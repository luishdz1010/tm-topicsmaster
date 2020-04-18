import gql from 'graphql-tag'
import { CONTEST_OWNER_PROJECTION } from './fragments'

export const CREATE_CONTEST = gql`
  mutation CreateContest($id: ID!) {
    createContest(id: $id) {
      ...ContestOwnerProjection
    }
  }
  ${CONTEST_OWNER_PROJECTION}
`

export const PUT_CONTEST_SPEAKER = gql`
  mutation PutContestSpeaker($input: PutContestSpeakerInput!) {
    putContestSpeaker(input: $input) {
      ...ContestOwnerProjection
    }
  }
  ${CONTEST_OWNER_PROJECTION}
`

export const DELETE_CONTEST_SPEAKER = gql`
  mutation DeleteContestSpeaker($contestId: ID!, $speakerId: ID!) {
    deleteContestSpeaker(contestId: $contestId, speakerId: $speakerId) {
      ...ContestOwnerProjection
    }
  }
  ${CONTEST_OWNER_PROJECTION}
`

export const OPEN_CONTEST_FOR_VOTES = gql`
  mutation OpenContestForVotes($contestId: ID!) {
    openContestForVotes(contestId: $contestId) {
      ...ContestOwnerProjection
    }
  }
  ${CONTEST_OWNER_PROJECTION}
`

export const END_CONTEST = gql`
  mutation EndContest($input: EndContestInput!) {
    endContest(input: $input) {
      ...ContestOwnerProjection
    }
  }
  ${CONTEST_OWNER_PROJECTION}
`

export const CREATE_CONTEST_VOTE = gql`
  mutation CreateContestVote($input: CreateContestVoteInput!) {
    createContestVote(input: $input) {
      contestPublicId
    }
  }
`

export const UPDATE_CONTEST_VOTE = gql`
  mutation UpdateContestVote($input: UpdateContestVoteInput!) {
    updateContestVote(input: $input) {
      contestPublicId
    }
  }
`
