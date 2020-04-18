/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FC, Fragment, FunctionComponent, useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  Step,
  StepButton,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { FIND_CONTEST } from '../graphql/queries'
import {
  ContestStatus,
  FindContestQuery,
  FindContestQueryVariables,
  OnContestVoteChangeSubscription,
  OnContestVoteChangeSubscriptionVariables,
  OnUpdateContestSubscription,
  OnUpdateContestSubscriptionVariables,
} from '../API'
import GraphQLError from './GraphQLError'
import { Redirect } from 'react-router-dom'
import ContestOwnerSpeakers from './ContestOwnerSpeakers'
import { ContestOwnerProjection } from '../types'
import {
  ON_CONTEST_VOTE_CHANGE,
  ON_UPDATE_CONTEST,
} from '../graphql/subscriptions'
import PublicLinShare from './PubliLinkShare'
import ContestOwnerVoteCounter from './ContestOwnerVoteCounter'
import Winners from './Winners'
import useLocalStorageState from 'use-local-storage-state'
import useContestOwnerId from '../lib/useContestOwnerId'

const statusToStep = {
  [ContestStatus.STARTED]: 0,
  [ContestStatus.VOTING]: 1,
  [ContestStatus.ENDED]: 2,
}

const Contest: FC<{
  contest: ContestOwnerProjection
}> = ({ contest }) => {
  const contestId = useContestOwnerId()
  const { status } = contest

  const [activeStep, setActiveStep] = useState<number>(statusToStep[status])
  const [localWinners, setLocalWinners] = useLocalStorageState<string[]>(
    `contest_${contestId}_winners`,
    [],
  )

  const steps = [
    {
      label: 'Add speakers as they participate',
      status: ContestStatus.STARTED,
      children: <ContestOwnerSpeakers contest={contest} />,
    },
    {
      label: 'Count the votes',
      status: ContestStatus.STARTED,
      children: (
        <ContestOwnerVoteCounter
          contest={contest}
          setLocalWinners={setLocalWinners}
        />
      ),
    },
    {
      label: 'Announce the winners',
      status: ContestStatus.STARTED,
      children: <Winners winners={contest.winners || localWinners} />,
    },
  ]

  useEffect(() => {
    setActiveStep(statusToStep[status])
  }, [status])

  return (
    <Fragment>
      <Typography variant="h4" component="h1" gutterBottom>
        Session Controller
      </Typography>

      <PublicLinShare publicId={contest.publicId} />

      <Box flex={1} width="100%">
        <Stepper
          nonLinear
          activeStep={activeStep}
          orientation="vertical"
          css={{ flex: 1, padding: 0, background: 'transparent' }}
        >
          {steps.map(({ label, children }, index) => (
            <Step key={index} completed={statusToStep[status] > index}>
              <StepLabel>
                <StepButton
                  onClick={() => setActiveStep(index)}
                  completed={activeStep === index}
                  css={{ justifyContent: 'flex-start' }}
                  disabled={statusToStep[status] < index}
                >
                  {label}
                </StepButton>
              </StepLabel>

              <StepContent>{children}</StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Fragment>
  )
}

const ContestOwnerView: FunctionComponent = () => {
  const contestId = useContestOwnerId()
  const { data, error, loading, refetch } = useQuery<
    FindContestQuery,
    FindContestQueryVariables
  >(FIND_CONTEST, {
    fetchPolicy: 'cache-and-network',
    variables: { id: contestId },
  })

  const contest = data?.findContestById
  const contestPublicId = contest?.publicId || '__empty__'

  const { error: contestSubscriptionError } = useSubscription<
    OnUpdateContestSubscription,
    OnUpdateContestSubscriptionVariables
  >(ON_UPDATE_CONTEST, {
    skip: !contest,
    variables: { contestPublicId },
  })

  const { error: voteSubscriptionError } = useSubscription<
    OnContestVoteChangeSubscription,
    OnContestVoteChangeSubscriptionVariables
  >(ON_CONTEST_VOTE_CHANGE, {
    skip: !contest,
    variables: { contestPublicId },
    onSubscriptionData() {
      refetch().catch(() => {})
    },
  })

  return (
    <Box
      flex={1}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <GraphQLError
        error={error || contestSubscriptionError || voteSubscriptionError}
      />
      {loading && !contest && <CircularProgress />}

      {contest && <Contest contest={contest} />}

      {contest === null && <Redirect to="/" />}
    </Box>
  )
}

export default ContestOwnerView
