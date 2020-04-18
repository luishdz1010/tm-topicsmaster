/** @jsx jsx */
import { jsx } from '@emotion/core'
import {
  Box,
  Button,
  Checkbox,
  CheckboxProps,
  Collapse,
  FormControl,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core'
import { CSSProperties, FC, FormEvent, useEffect, useState } from 'react'
import { ContestOwnerProjection } from '../types'
import { Autocomplete } from '@material-ui/lab'
import compact from 'lodash/compact'
import sortBy from 'lodash/sortBy'
import { useMutation } from '@apollo/react-hooks'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import {
  ContestStatus,
  DeleteContestSpeakerMutation,
  DeleteContestSpeakerMutationVariables,
  OpenContestForVotesMutation,
  OpenContestForVotesMutationVariables,
  PutContestSpeakerMutation,
  PutContestSpeakerMutationVariables,
} from '../API'
import {
  DELETE_CONTEST_SPEAKER,
  OPEN_CONTEST_FOR_VOTES,
  PUT_CONTEST_SPEAKER,
} from '../graphql/mutations'
import uuidv4 from '../lib/uuidv4'
import useContestOwnerId from '../lib/useContestOwnerId'
import GraphQLError from './GraphQLError'
import { AutocompleteProps } from '@material-ui/lab/Autocomplete/Autocomplete'
import { TransitionGroup } from 'react-transition-group'

interface SpeakerNameInputProps
  extends Omit<AutocompleteProps<string>, 'renderInput' | 'options'> {
  suggestedNames: string[]
}

const SpeakerNameInput: FC<SpeakerNameInputProps> = ({
  suggestedNames,
  placeholder,
  ...props
}) => (
  <Autocomplete
    {...props}
    freeSolo
    disableClearable
    multiple={false}
    options={suggestedNames}
    renderInput={(params) => (
      <TextField {...params} label="Name" required placeholder={placeholder} />
    )}
  />
)

const WordOfTheDayInput: FC<CheckboxProps> = (props) => (
  <FormControl fullWidth css={{ marginTop: 'auto' }}>
    <FormControlLabel
      control={<Checkbox {...props} color="primary" />}
      label="Word of the Day?"
    />
  </FormControl>
)

const initialSpeakerState: {
  name: string | null
  wordOfTheDay: boolean
  time: string | null
} = {
  name: null,
  wordOfTheDay: false,
  time: null,
}

const useSpeakerForm = (
  {
    id,
    defaultValues,
  }: {
    id?: string
    defaultValues: typeof initialSpeakerState
  } = {
    defaultValues: initialSpeakerState,
  },
) => {
  const [speakerForm, setSpeakerForm] = useState(defaultValues)
  const contestId = useContestOwnerId()
  const [putSpeaker, { error, loading }] = useMutation<
    PutContestSpeakerMutation,
    PutContestSpeakerMutationVariables
  >(PUT_CONTEST_SPEAKER)

  return {
    isSubmitting: loading,
    setSpeakerForm,
    onSubmit(ev: FormEvent<unknown>) {
      ev.preventDefault()
      const name = speakerForm.name

      if (!name) throw new Error('missing name')

      putSpeaker({
        variables: {
          input: {
            id: id || uuidv4(),
            contestId,
            name,
            time: speakerForm.time,
            wordOfTheDay: speakerForm.wordOfTheDay,
          },
        },
      })
        .catch(() => {})
        .finally(() => {
          if (!id) setSpeakerForm(defaultValues)
        })
    },
    submitProps: {
      disabled: loading || !speakerForm.name,
    },
    error,
    name: {
      value: speakerForm.name || '',
      placeholder: defaultValues.name ?? '',
      inputValue: speakerForm.name || '',
      onInputChange(ev: unknown, newValue: string | null, reason: any) {
        console.log(reason)
        setSpeakerForm((s) => ({
          ...s,
          name: newValue || null,
        }))
      },
    },
    time: {
      label: 'Time',
      placeholder: defaultValues.time ?? 'e.g. 1:54',
      value: speakerForm.time || '',
      onChange(ev: { target: { value: string } }) {
        const val = ev.target.value
        setSpeakerForm((s) => ({
          ...s,
          time: val || null,
        }))
      },
    },
    wordOfTheDay: {
      checked: speakerForm.wordOfTheDay,
      onChange(ev: { target: { checked: boolean } }) {
        const wotd = ev.target.checked
        setSpeakerForm((s) => ({
          ...s,
          wordOfTheDay: wotd,
        }))
      },
    },
  }
}

const SpeakerItem: FC<{
  suggestedNames: string[]
  speaker: ContestOwnerProjection['speakers'][number]
  even: boolean
  style?: CSSProperties
  canEdit: boolean
}> = ({ suggestedNames, speaker, even, style, canEdit }) => {
  const contestId = useContestOwnerId()
  const {
    isSubmitting,
    setSpeakerForm,
    name,
    time,
    wordOfTheDay,
    onSubmit,
    submitProps,
    error,
  } = useSpeakerForm({
    id: speaker.id,
    defaultValues: speaker,
  })

  useEffect(() => {
    setSpeakerForm((s) => ({
      ...s,
      name: speaker.name,
    }))
  }, [setSpeakerForm, speaker.name])

  useEffect(() => {
    setSpeakerForm((s) => ({
      ...s,
      time: speaker.time,
    }))
  }, [setSpeakerForm, speaker.time])

  useEffect(() => {
    setSpeakerForm((s) => ({
      ...s,
      wordOfTheDay: speaker.wordOfTheDay,
    }))
  }, [setSpeakerForm, speaker.wordOfTheDay])

  const [
    deleteSpeaker,
    { error: deleteError, loading: isDeleting },
  ] = useMutation<
    DeleteContestSpeakerMutation,
    DeleteContestSpeakerMutationVariables
  >(DELETE_CONTEST_SPEAKER, { variables: { contestId, speakerId: speaker.id } })

  const isEditing =
    speaker.wordOfTheDay !== wordOfTheDay.checked ||
    speaker.name !== (name.value || null) ||
    speaker.time !== (time.value || null)

  const isLoading = isSubmitting || isDeleting

  const { palette } = useTheme()

  return (
    <Box
      style={style}
      paddingY={{ xs: 3, md: 1.5 }}
      paddingX={{ xs: 1.5 }}
      marginX={{ xs: -1.5, sm: 0 }}
      display="grid"
      gridGap={{ xs: 9, sm: 24 }}
      gridTemplateColumns={{
        xs: 'minmax(0, 100%)',
        sm: '2fr 1fr 1fr',
        md: '2fr 1fr max-content 144px',
      }}
      css={{
        backgroundColor: even ? palette.grey['100'] : undefined,
      }}
      clone
    >
      <form autoComplete="off" onSubmit={onSubmit}>
        <SpeakerNameInput
          {...name}
          suggestedNames={suggestedNames}
          disabled={!canEdit}
        />
        <TextField {...time} disabled={!canEdit} />
        <WordOfTheDayInput {...wordOfTheDay} disabled={!canEdit} />

        <Box>
          <IconButton
            title={`Save ${name.value}`}
            type="submit"
            {...submitProps}
            disabled={
              submitProps.disabled || !isEditing || isLoading || !canEdit
            }
            color="primary"
          >
            <SaveIcon />
          </IconButton>

          <IconButton
            title={`Delete ${name.value}`}
            color="secondary"
            disabled={isLoading || !canEdit}
            onClick={() => {
              deleteSpeaker().catch(() => {})
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <GraphQLError
          error={error || deleteError}
          css={{
            gridColumn: '1/-1',
          }}
        />
      </form>
    </Box>
  )
}

const ContestOwnerSpeakers: FC<{
  contest: ContestOwnerProjection
}> = ({ contest }) => {
  const {
    name,
    time,
    wordOfTheDay,
    onSubmit,
    submitProps,
    error,
  } = useSpeakerForm()

  const { breakpoints } = useTheme()

  const suggestedNames = compact(contest.votes?.map((v) => v.voterName))

  const contestId = useContestOwnerId()

  const [
    openContestForVotes,
    { error: openContestError, loading: openContestLoading },
  ] = useMutation<
    OpenContestForVotesMutation,
    OpenContestForVotesMutationVariables
  >(OPEN_CONTEST_FOR_VOTES, { variables: { contestId } })

  return (
    <Box flex={1} marginTop={{ xs: 3 }}>
      <Box display="grid" marginTop={3} marginBottom={3}>
        <TransitionGroup component={null}>
          {sortBy(contest.speakers, 'createdAt').map((s, idx) => (
            <Collapse key={s.id}>
              <SpeakerItem
                key={s.id}
                suggestedNames={suggestedNames}
                speaker={s}
                even={(idx + 1) % 2 === 0}
                canEdit={contest.status !== ContestStatus.ENDED}
              />
            </Collapse>
          ))}
        </TransitionGroup>
      </Box>

      {contest.status === ContestStatus.STARTED && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Add {contest.speakers.length > 0 ? 'another' : 'a'} speaker
          </Typography>
          <Box
            display="grid"
            gridGap={{ xs: 9, sm: 24 }}
            gridTemplateColumns={{
              xs: 'minmax(0, 100%)',
              sm: '2fr 1fr 1fr',
              md: '2fr 1fr max-content 144px',
            }}
            clone
          >
            <form autoComplete="off" onSubmit={onSubmit}>
              <SpeakerNameInput {...name} suggestedNames={suggestedNames} />
              <TextField {...time} />
              <WordOfTheDayInput {...wordOfTheDay} />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                css={{ marginTop: 'auto' }}
                {...submitProps}
              >
                Add Speaker
              </Button>

              <GraphQLError error={error} />
            </form>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            marginTop={6}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              css={{
                width: '100%',
                marginBottom: 8,
                [breakpoints.up('sm')]: {
                  width: '50%',
                },
              }}
              disabled={contest.speakers.length < 2 || openContestLoading}
              onClick={() => {
                openContestForVotes().catch(() => {})
              }}
            >
              Submit participants
            </Button>
            <Typography variant="caption">
              Make sure there are no more participants before submitting.
            </Typography>
            <GraphQLError error={openContestError} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ContestOwnerSpeakers
