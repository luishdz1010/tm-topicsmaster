import gql from 'graphql-tag'
import {
  CONTEST_OWNER_PROJECTION,
  CONTEST_PUBLIC_PROJECTION,
} from './fragments'

export const ON_UPDATE_CONTEST = gql`
  subscription OnUpdateContest($contestPublicId: ID!) {
    onUpdateContest(publicId: $contestPublicId) {
      ...ContestOwnerProjection
    }
  }
  ${CONTEST_OWNER_PROJECTION}
`

export const ON_CONTEST_VOTE_CHANGE = gql`
  subscription OnContestVoteChange($contestPublicId: ID!) {
    onContestVoteChange(contestPublicId: $contestPublicId) {
      contestPublicId
    }
  }
`

export const ON_UPDATE_PUBLIC_CONTEST = gql`
  subscription OnUpdatePublicContest($publicId: ID!) {
    onUpdateContest(publicId: $publicId) {
      ...ContestPublicProjection
    }
  }
  ${CONTEST_PUBLIC_PROJECTION}
`
