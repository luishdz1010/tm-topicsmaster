import gql from 'graphql-tag'

export const CONTEST_OWNER_PROJECTION = gql`
  fragment ContestOwnerProjection on Contest {
    publicId
    status
    statusChangedAt
    speakers {
      id
      name
      wordOfTheDay
      time
      createdAt
    }
    winners
  }
`

export const VOTE = gql`
  fragment Vote on ContestVote {
    contestPublicId
    voterName
    createdAt
    winners
  }
`

export const CONTEST_PUBLIC_PROJECTION = gql`
  fragment ContestPublicProjection on Contest {
    publicId
    status
    statusChangedAt
    speakers {
      id
      name
      wordOfTheDay
      time
      createdAt
    }
    winners
  }
`
