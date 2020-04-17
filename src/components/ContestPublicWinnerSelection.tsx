/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FC, forwardRef, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Typography,
} from '@material-ui/core'
import { ContestPublicProjection, ContestVote, GradedSpeaker } from '../types'
import { sortBy, uniq, compact } from 'lodash'
import {
  ContestStatus,
  UpdateContestVoteMutation,
  UpdateContestVoteMutationVariables,
} from '../API'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_CONTEST_VOTE } from '../graphql/mutations'
import GraphQLError from './GraphQLError'
import { Alert } from '@material-ui/lab'
import Confirm from './Confirm'
import useLocalStorageState from 'use-local-storage-state'
import useContestPublicId from '../lib/useContestPublicId'
import { winnerLabels } from '../lib/winner-labels'

const SpeakerSelect = forwardRef<
  HTMLSelectElement,
  {
    place: string
    speakers: GradedSpeaker[]
    value: string | null
    onChange: (speakerId: string) => void
    othersSelected: Array<string | null>
    tabIndex: number
    disabled?: boolean
  }
>(
  (
    {
      place,
      speakers,
      value,
      onChange,
      othersSelected,
      tabIndex,
      disabled = false,
    },
    ref,
  ) => {
    const id = `speaker-select-${place}`
    const error = !!value && othersSelected.includes(value)

    return (
      <FormControl
        variant="outlined"
        css={{
          display: 'block',
          marginTop: 8,
          width: 400,
          maxWidth: '100%',
        }}
        required={!disabled}
        disabled={disabled}
        error={error}
      >
        <InputLabel htmlFor={id}>{place} Place</InputLabel>
        <Select
          native
          value={value || ''}
          label={`${place} Place`}
          onChange={(ev) => {
            onChange(ev.target.value as string)
          }}
          inputProps={{
            id,
            tabIndex,
            ref,
          }}
          css={{ width: '100%' }}
        >
          <option value="" />
          {speakers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        {error && (
          <FormHelperText>You can't pick the same person twice</FormHelperText>
        )}
      </FormControl>
    )
  },
)

export const ContestPublicWinnerSelection: FC<{
  contest: ContestPublicProjection
  speakers: GradedSpeaker[]
  vote: ContestVote
}> = ({ contest, speakers, vote }) => {
  const publicId = useContestPublicId()
  const firstInputRef = useRef<HTMLSelectElement | null>(null)
  const [selection, setSelection] = useLocalStorageState<Array<string | null>>(
    `pcontest_${publicId}_winners`,
    [null, null, null],
  )

  const changeSelection = (idx: number) => (val: string) => {
    setSelection((s) => {
      const newSel = [...s]
      newSel[idx] = val
      return newSel
    })
  }

  const speakersByGrade = sortBy(speakers, ['totalPoints', 'name']).reverse()

  const isVoting = contest.status === ContestStatus.VOTING
  const tabIndex = isVoting ? 0 : -1

  useEffect(() => {
    if (isVoting) firstInputRef.current!.focus()
  }, [isVoting])

  const [voteFullySubmitted, setVoteFullySubmitted] = useLocalStorageState(
    `pcontest_${publicId}_voted`,
    false,
  )

  const [updateVote, { loading, error }] = useMutation<
    UpdateContestVoteMutation,
    UpdateContestVoteMutationVariables
  >(UPDATE_CONTEST_VOTE, {
    onCompleted() {
      setVoteFullySubmitted(true)
    },
  })

  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyItems="center"
      css={{
        transition: 'all 1s ease',
        opacity: !isVoting ? 0.4 : 1,
        pointerEvents: !isVoting ? 'none' : 'inherit',
        userSelect: 'none',
        filter: !isVoting ? 'grayscale(1)' : 'none',
      }}
      aria-hidden={!isVoting}
      borderRadius="borderRadius"
      boxShadow={1}
      padding={3}
      mb={4}
      maxWidth="100%"
    >
      <Typography variant="h5" align="center" gutterBottom>
        Pick your winners
      </Typography>

      <form
        css={{ display: 'block' }}
        onSubmit={(ev) => {
          ev.preventDefault()

          const winners = compact(selection)

          if (uniq(winners).length !== Math.min(3, speakers.length)) {
            console.error('not all winners selected')
            return
          }

          setConfirmOpen(true)
        }}
      >
        <SpeakerSelect
          ref={firstInputRef}
          place={winnerLabels[0].label}
          speakers={speakersByGrade}
          value={selection[0]}
          onChange={changeSelection(0)}
          tabIndex={tabIndex}
          disabled={voteFullySubmitted}
          othersSelected={selection.slice(1)}
        />
        <SpeakerSelect
          place={winnerLabels[1].label}
          speakers={speakersByGrade}
          value={selection[1]}
          onChange={changeSelection(1)}
          tabIndex={tabIndex}
          disabled={voteFullySubmitted}
          othersSelected={[selection[0], selection[2]]}
        />

        <SpeakerSelect
          place={winnerLabels[2].label}
          speakers={speakersByGrade}
          value={selection[2]}
          onChange={changeSelection(2)}
          tabIndex={tabIndex}
          disabled={speakers.length <= 2 || voteFullySubmitted}
          othersSelected={selection.slice(0, 2)}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          css={{
            marginTop: 24,
            marginBottom: 24,
            width: '100%',
            maxWidth: 400,
          }}
          disabled={loading || voteFullySubmitted}
        >
          Submmit Your Vote
        </Button>

        {voteFullySubmitted && (
          <Alert severity="success">
            Your vote was submitted successfully! You can ☕️ now
          </Alert>
        )}

        <GraphQLError error={error} css={{ maxWidth: 400 }} />
      </form>

      <Confirm
        keepMounted
        open={confirmOpen}
        onClose={(ok) => {
          if (ok) {
            const winners = compact(selection)
            updateVote({
              variables: {
                input: {
                  ...vote,
                  winners,
                },
              },
            }).catch(() => {})
          }

          setConfirmOpen(false)
        }}
      >
        Are you sure you want to submit these winners? You cannot change these
        later.
      </Confirm>
    </Box>
  )
}
