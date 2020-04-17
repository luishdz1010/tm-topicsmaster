import { ContestPublicProjectionFragment, FindContestQuery } from './API'

export type ContestOwnerProjection = Exclude<
  FindContestQuery['findContestById'],
  null
>

export type ContestPublicProjection = ContestPublicProjectionFragment

export type GradedSpeaker = ContestPublicProjection['speakers'][number] & {
  grade: SpeakerGrade
  totalPoints: number
}

export interface SpeakerGrade {
  pose: number
  development: number
  theme: number
}

export interface ContestVote {
  id: string
  voterName: string
}
