/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FC, Fragment, useCallback, useMemo } from 'react'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { FIND_CONTEST_BY_PUBLIC_ID } from '../graphql/queries'
import {
  ContestStatus,
  FindContestByPublicIdQuery,
  FindContestByPublicIdQueryVariables,
  OnUpdatePublicContestSubscription,
  OnUpdatePublicContestSubscriptionVariables,
} from '../API'
import useContestPublicId from '../lib/useContestPublicId'
import { ON_UPDATE_PUBLIC_CONTEST } from '../graphql/subscriptions'
import { Box, CircularProgress, Typography } from '@material-ui/core'
import GraphQLError from './GraphQLError'
import { ContestPublicProjection, ContestVote, SpeakerGrade } from '../types'
import { Redirect } from 'react-router-dom'
import { sortBy } from 'lodash'
import useLocalStorageState from 'use-local-storage-state'
import { ContestPublicWinnerSelection } from './ContestPublicWinnerSelection'
import ContestPublicStartVote from './ContestPublicStartVote'
import { ContestPublicGrader } from './ContestPublicGrader'
import PublicWinners from './PublicWinners'

const ContestPublic: FC<{
  contest: ContestPublicProjection
  vote: ContestVote
}> = ({ contest, vote }) => {
  const publicId = useContestPublicId()

  const [gradings, setGradings] = useLocalStorageState<{
    [k: string]: SpeakerGrade | undefined
  }>(`pcontest_${publicId}_grades`, {})

  const onGradeChange = useCallback(
    (id: string, grade: SpeakerGrade) => {
      setGradings((g) => ({ ...g, [id]: grade }))
    },
    [setGradings],
  )

  const speakers = useMemo(() => sortBy(contest.speakers, 'createdAt'), [
    contest.speakers,
  ])

  const gradedSpeakers = useMemo(() => {
    return speakers.map((s) => {
      const grade = gradings[s.id] || { pose: 0, development: 0, theme: 0 }
      return {
        ...s,
        grade,
        totalPoints:
          Object.values(grade).reduce((r, sum) => sum + r, 0) +
          (s.wordOfTheDay ? 1 : 0),
      }
    })
  }, [speakers, gradings])

  const isGrading =
    contest.status === ContestStatus.STARTED ||
    contest.status === ContestStatus.VOTING

  return (
    <Fragment>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Table Topics Evaluation Sheet
      </Typography>

      <ContestPublicGrader
        speakers={gradedSpeakers}
        onGradeChange={onGradeChange}
        isGrading={isGrading}
      />

      <ContestPublicWinnerSelection
        contest={contest}
        speakers={gradedSpeakers}
        vote={vote}
      />
    </Fragment>
  )
}

const ContestPublicView: FC = () => {
  const publicId = useContestPublicId()
  const [vote, setVote] = useLocalStorageState<ContestVote>(
    `pcontest_${publicId}_vote`,
  )
  const { data, error, refetch } = useQuery<
    FindContestByPublicIdQuery,
    FindContestByPublicIdQueryVariables
  >(FIND_CONTEST_BY_PUBLIC_ID, { variables: { publicId } })

  const { error: contestSubscriptionError } = useSubscription<
    OnUpdatePublicContestSubscription,
    OnUpdatePublicContestSubscriptionVariables
  >(ON_UPDATE_PUBLIC_CONTEST, {
    variables: { publicId },
  })

  const contest = data?.findContestByPublicId

  function view() {
    if (!contest) {
      return (
        <Fragment>
          <CircularProgress />
          {contest === null && <Redirect to="/" />}
        </Fragment>
      )
    }

    if (contest.status === ContestStatus.ENDED)
      return <PublicWinners contest={contest} refetchContest={refetch} />

    if (!vote) return <ContestPublicStartVote onContestVoteCreated={setVote} />

    return <ContestPublic contest={contest} vote={vote} />
  }

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <GraphQLError error={error || contestSubscriptionError} />
      {view()}
    </Box>
  )
}

export default ContestPublicView
