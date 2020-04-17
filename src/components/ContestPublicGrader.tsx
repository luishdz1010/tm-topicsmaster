/** @jsx jsx */
import { jsx } from '@emotion/core'
import { FC, Fragment, useEffect, useState } from 'react'
import { Box, Typography, TypographyProps, useTheme } from '@material-ui/core'
import StarRatingComponent from 'react-star-rating-component'
import { GradedSpeaker, SpeakerGrade } from '../types'

const Rating: FC<{ value: number; onChange: (val: number) => void }> = ({
  value,
  onChange,
}) => {
  const {
    breakpoints: { up },
  } = useTheme()
  const [hoverValue, setHoverValue] = useState(value)

  useEffect(() => {
    setHoverValue(value)
  }, [value])

  return (
    <StarRatingComponent
      name=""
      starCount={3}
      value={hoverValue}
      onStarClick={onChange}
      onStarHover={(val) => {
        setHoverValue(val)
      }}
      onStarHoverOut={() => {
        setHoverValue(value)
      }}
      css={{
        fontSize: 25,
        marginLeft: -4,
        marginRight: -4,
        display: 'inline-flex !important',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',

        [up('md')]: {
          fontSize: 22,
        },

        '.dv-star-rating-star': {
          float: 'none !important' as 'none',
          padding: '0 4px',

          [up('md')]: {
            padding: '0',
          },
        },
      }}
    />
  )
}
const MobileHeader: FC<TypographyProps> = ({ children, ...props }) => {
  const {
    palette,
    breakpoints: { up },
  } = useTheme()

  return (
    <Typography
      css={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: palette.grey['200'],
        [up('md')]: { display: 'none' },
      }}
      {...props}
    >
      <strong>{children}</strong>
    </Typography>
  )
}
const Header: FC = ({ children }) => (
  <Typography variant="subtitle2" align="center" css={{ alignSelf: 'start' }}>
    {children}
  </Typography>
)
const SpeakerItem: FC<{
  index: number
  speaker: GradedSpeaker | null
  onGradeChange: (id: string, grade: SpeakerGrade) => void
}> = ({ index, speaker, onGradeChange }) => {
  const {
    palette,
    breakpoints: { up },
  } = useTheme()

  const grades = speaker?.grade

  const changeGrade = (area: keyof SpeakerGrade) => (newVal: number) => {
    if (speaker)
      onGradeChange(speaker.id, {
        ...speaker.grade,
        [area]: newVal,
      })
  }

  return (
    <Box
      css={{
        display: speaker ? 'grid' : 'none',
        [up('md')]: {
          display: 'contents',
        },
      }}
      width="100%"
      gridGap={8}
      gridTemplateColumns={{ xs: 'minmax(0, auto) 1fr', sm: 'repeat(4, 1fr)' }}
      bgcolor={palette.common.white}
      boxShadow={1}
      padding={{ xs: 2, md: 0 }}
      borderRadius="borderRadius"
    >
      <MobileHeader
        variant="h6"
        css={{
          gridColumn: '1/-1',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        {index + 1} - <span>{speaker?.name}</span>
      </MobileHeader>

      <Typography
        css={{
          display: 'none',
          [up('md')]: {
            display: 'flex',
          },
        }}
      >
        {index + 1}
      </Typography>

      <Typography
        css={{
          display: 'none',

          [up('md')]: {
            display: 'flex',
            justifySelf: 'start',
          },
        }}
      >
        {speaker?.name}
      </Typography>

      {grades ? (
        <Fragment>
          <MobileHeader>Pose</MobileHeader>
          <Rating value={grades.pose} onChange={changeGrade('pose')} />

          <MobileHeader>Development</MobileHeader>
          <Rating
            value={grades.development}
            onChange={changeGrade('development')}
          />

          <MobileHeader>Theme</MobileHeader>
          <Rating value={grades.theme} onChange={changeGrade('theme')} />
        </Fragment>
      ) : (
        <Box gridColumn={{ xs: '1/-2', md: '3 / span 3' }} />
      )}

      <MobileHeader>Word of the Day</MobileHeader>
      <Typography>
        {speaker ? (speaker.wordOfTheDay ? '✅' : '❌') : ''}
      </Typography>

      <MobileHeader>Time</MobileHeader>
      <Typography>{speaker?.time}</Typography>

      <MobileHeader>Total Points</MobileHeader>
      <Typography>{speaker?.totalPoints}</Typography>
    </Box>
  )
}
export const ContestPublicGrader: FC<{
  isGrading: boolean
  speakers: Array<GradedSpeaker | null>
  onGradeChange: (id: string, grade: SpeakerGrade) => void
}> = ({ speakers, isGrading, onGradeChange }) => (
  <Box
    display="flex"
    flexDirection="column"
    css={
      {
        transition: 'all 600ms ease',
        opacity: !isGrading ? 0.4 : 1,
        pointerEvents: !isGrading ? 'none' : 'inherit',
        userSelect: 'none',
        filter: !isGrading ? 'grayscale(1)' : 'none',
      } as const
    }
  >
    <Box
      display="grid"
      width="100%"
      gridGap={{ xs: 32, md: 16 }}
      gridTemplateColumns={{
        xs: '100%',
        md: '20px 160px repeat(3, 1fr) 65px 80px 50px',
      }}
      gridAutoRows="minmax(32px, auto)"
      alignItems="center"
      justifyItems="center"
      marginTop={4}
      marginBottom={4}
      bgcolor={{ md: 'common.white' }}
      padding={{ md: 3 }}
      borderRadius="borderRadius"
      boxShadow={{ md: 1 }}
    >
      {speakers.length === 0 && (
        <Box
          padding={2}
          bgcolor="common.white"
          borderRadius="borderRadius"
          display={{ md: 'none' }}
          width="100%"
          clone
        >
          <Typography color="textSecondary" align="center">
            Speakers will appear here shortly
          </Typography>
        </Box>
      )}

      <Box display={{ xs: 'none', md: 'contents' }}>
        <Header> </Header>
        <Header>Speaker</Header>
        <Header>Pose</Header>
        <Header>Development</Header>
        <Header>Theme</Header>
        <Header>Word of the Day</Header>
        <Header>Time</Header>
        <Header>Total Points</Header>
      </Box>

      {speakers.map((s, idx) => (
        <SpeakerItem
          key={s?.id || idx}
          speaker={s}
          index={idx}
          onGradeChange={onGradeChange}
        />
      ))}
    </Box>

    <Box mb={6}>
      <Typography gutterBottom>
        Grade each speaker as they appear above using the following criteria:
      </Typography>

      <Typography gutterBottom>
        <strong>Pose:</strong> Was the speech enhanced by appropriate non-verbal
        gestures that reinforced the strength of the idea?
      </Typography>
      <Typography gutterBottom>
        <strong>Development:</strong> Was there a clear and coherent structure
        to the speech between intro, body and conclusion?
      </Typography>

      <Typography>
        <strong>Theme: </strong>Was the speech aligned to what was asked as a
        Table Topic question?
      </Typography>
    </Box>
  </Box>
)
