import gql from 'graphql-tag'
import {
  CONTEST_OWNER_PROJECTION,
  CONTEST_PUBLIC_PROJECTION,
  VOTE,
} from './fragments'

export const FIND_CONTEST = gql`
  query FindContest($id: ID!) {
    findContestById(id: $id) {
      ...ContestOwnerProjection
      votes(contestId: $id) {
        ...Vote
      }
    }
  }
  ${CONTEST_OWNER_PROJECTION}
  ${VOTE}
`

export const FIND_CONTEST_BY_PUBLIC_ID = gql`
  query FindContestByPublicId($publicId: ID!) {
    findContestByPublicId(publicId: $publicId) {
      ...ContestPublicProjection
    }
  }
  ${CONTEST_PUBLIC_PROJECTION}
`
