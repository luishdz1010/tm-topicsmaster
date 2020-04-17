/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Box, Button, TextField, Typography } from '@material-ui/core'
import { ContestOwnerProjection } from '../types'
import { FC, useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { EndContestMutation, EndContestMutationVariables } from '../API'
import { END_CONTEST } from '../graphql/mutations'
import useContestOwnerId from '../lib/useContestOwnerId'
import Confirm from './Confirm'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import GraphQLError from './GraphQLError'
import { winnerLabels } from '../lib/winner-labels'

const filterOptions = createFilterOptions({
  matchFrom: 'start',
})

const ContestOwnerWinnerSelection: FC<{
  contest: ContestOwnerProjection
  setLocalWinners: (winners: string[]) => void
  isVoting: boolean
}> = ({ contest, setLocalWinners, isVoting }) => {
  const contestId = useContestOwnerId()
  const places = winnerLabels.slice(0, contest.speakers.length)

  const [winners, setWinners] = useState(
    new Array<string>(places.length).fill(''),
  )

  const [endContest, { error, data, loading }] = useMutation<
    EndContestMutation,
    EndContestMutationVariables
  >(END_CONTEST)

  const [confirmOpen, setConfirmOpen] = useState(false)

  const suggestedNames = contest.speakers.map((s) => s.name)

  return (
    <Box
      display={isVoting ? 'flex' : 'none'}
      flexDirection="column"
      justifyItems="center"
      borderRadius="borderRadius"
      boxShadow={1}
      padding={3}
      mb={3}
      mt={6}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Pick <em>the</em> winners
      </Typography>

      <form
        onSubmit={(ev) => {
          ev.preventDefault()

          setConfirmOpen(true)
        }}
      >
        {places.map(({ label }, idx) => (
          <Autocomplete
            key={idx}
            id={`pick-winner-${idx}`}
            freeSolo
            disableClearable
            multiple={false}
            options={suggestedNames}
            inputValue={winners[idx]}
            filterOptions={filterOptions}
            onInputChange={(ev, newValue: string | null) => {
              setWinners((state) =>
                state.map((winner, winnerIdx) =>
                  winnerIdx === idx ? newValue || '' : winner,
                ),
              )
            }}
            renderInput={(params) => (
              <TextField
                label={`${label} Place`}
                css={{
                  display: 'block',
                  marginTop: 8,
                  width: 400,
                  maxWidth: '100%',
                }}
                fullWidth
                required
                {...params}
              />
            )}
          />
        ))}

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
          disabled={!!(loading || data)}
        >
          End Contest
        </Button>

        <GraphQLError error={error} css={{ maxWidth: 400 }} />
      </form>

      <Typography>
        Tip: If there is a tie, insert something like "John and Cathy".
      </Typography>

      <Confirm
        keepMounted
        open={confirmOpen}
        onClose={(ok) => {
          if (ok) {
            endContest({
              variables: {
                input: {
                  contestId,
                  winners,
                  notes: null,
                },
              },
            })
              .then(() => {
                setLocalWinners(winners)
              })
              .catch(() => {})
          }

          setConfirmOpen(false)
        }}
      >
        Are you sure you want to end the contest and submit the winners? You
        cannot change these later.
      </Confirm>
    </Box>
  )
}

export default ContestOwnerWinnerSelection
