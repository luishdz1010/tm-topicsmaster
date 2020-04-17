/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FunctionComponent, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Grow,
  Typography,
  useTheme,
} from '@material-ui/core'
import { useMutation } from '@apollo/react-hooks'
import { CreateContestMutation, CreateContestMutationVariables } from '../API'
import uuidv4 from '../lib/uuidv4'
import { useHistory } from 'react-router-dom'
import GraphQLError from './GraphQLError'
import { CREATE_CONTEST } from '../graphql/mutations'

const StartContestView: FunctionComponent = () => {
  const { spacing } = useTheme()
  const [contestId, setContestId] = useState<string>()
  const history = useHistory()
  const [createContest, { error, loading }] = useMutation<
    CreateContestMutation,
    CreateContestMutationVariables
  >(CREATE_CONTEST, {
    onCompleted({ createContest }) {
      history.replace(`/c/owner/${contestId}`)
    },
  })

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="column"
      paddingY={5}
      paddingX={2}
      maxWidth={{ xs: '100%', md: 700 }}
      marginX="auto"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      css={{ '> :last-child': { marginBottom: 0 } }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the Topicsmaster Master
      </Typography>
      <Typography>
        If today you are a General Evaluator, Sergeant at Arms or were
        instructed by a club's officer, use this tool to start a new Table Topics
        voting session.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        css={{ margin: spacing(4, 0) }}
        onClick={() => {
          const id = uuidv4()
          setContestId(id)
          createContest({ variables: { id } }).catch(() => {})
        }}
        disabled={loading}
      >
        Start New Table Topics Session
      </Button>
      <Grow in={loading}>
        <CircularProgress />
      </Grow>
      <GraphQLError error={error} />
    </Box>
  )
}

export default StartContestView
