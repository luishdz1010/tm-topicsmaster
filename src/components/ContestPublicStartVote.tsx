/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Box, Button, TextField, Typography, Zoom } from '@material-ui/core'
import GraphQLError from './GraphQLError'
import { useMutation } from '@apollo/react-hooks'
import { CREATE_CONTEST_VOTE } from '../graphql/mutations'
import {
  CreateContestVoteMutation,
  CreateContestVoteMutationVariables,
} from '../API'
import { FC, useEffect, useRef, useState } from 'react'
import uuidv4 from '../lib/uuidv4'
import useContestPublicId from '../lib/useContestPublicId'
import { ContestVote } from '../types'

const ContestPublicStartVote: FC<{
  onContestVoteCreated: (vote: ContestVote) => void
}> = ({ onContestVoteCreated }) => {
  const contestPublicId = useContestPublicId()
  const [name, setName] = useState('')
  const voteId = useRef<string>()
  const [createContestVote, { data, error, loading }] = useMutation<
    CreateContestVoteMutation,
    CreateContestVoteMutationVariables
  >(CREATE_CONTEST_VOTE, {
    onCompleted() {
      onContestVoteCreated({ id: voteId.current!, voterName: name })
    },
  })

  const [formIn, setFormIn] = useState(false)

  useEffect(() => {
    const handle = setTimeout(() => {
      setFormIn(true)
    }, 300)

    return () => {
      clearTimeout(handle)
    }
  }, [])

  return (
    <Box maxWidth="100%">
      <Typography variant="h3" gutterBottom>
        What's your name?
      </Typography>

      <Zoom
        in={formIn}
        timeout={300}
        css={{ display: 'flex', flexDirection: 'column' }}
      >
        <form
          onSubmit={(ev) => {
            ev.preventDefault()

            const id = uuidv4()
            voteId.current = id

            createContestVote({
              variables: { input: { id, voterName: name, contestPublicId } },
            }).catch(() => {})
          }}
        >
          <TextField
            label="Name"
            placeholder="e.g. John Connor"
            value={name}
            onChange={(ev) => {
              setName(ev.target.value)
            }}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={!!(loading || data)}
            css={{
              display: 'block',
              margin: '32px auto 0',
              width: 400,
              maxWidth: '100%',
            }}
          >
            Let's do it
          </Button>
        </form>
      </Zoom>

      <GraphQLError error={error} />
    </Box>
  )
}

export default ContestPublicStartVote
