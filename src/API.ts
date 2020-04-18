/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export enum ContestStatus {
  STARTED = "STARTED",
  VOTING = "VOTING",
  ENDED = "ENDED",
}


export type PutContestSpeakerInput = {
  contestId: string,
  id: string,
  name: string,
  wordOfTheDay?: boolean | null,
  time?: string | null,
};

export type EndContestInput = {
  contestId: string,
  winners: Array< string >,
  notes?: string | null,
};

export type CreateContestVoteInput = {
  id: string,
  contestPublicId: string,
  voterName: string,
};

export type UpdateContestVoteInput = {
  id: string,
  voterName: string,
  winners: Array< string >,
};

export type CreateContestMutationVariables = {
  id: string,
};

export type CreateContestMutation = {
  createContest:  {
    __typename: "Contest",
    publicId: string,
    status: ContestStatus,
    statusChangedAt: string,
    speakers:  Array< {
      __typename: "Speaker",
      id: string,
      name: string,
      wordOfTheDay: boolean,
      time: string | null,
      createdAt: string,
    } >,
    winners: Array< string > | null,
  } | null,
};

export type PutContestSpeakerMutationVariables = {
  input: PutContestSpeakerInput,
};

export type PutContestSpeakerMutation = {
  putContestSpeaker:  {
    __typename: "Contest",
    publicId: string,
    status: ContestStatus,
    statusChangedAt: string,
    speakers:  Array< {
      __typename: "Speaker",
      id: string,
      name: string,
      wordOfTheDay: boolean,
      time: string | null,
      createdAt: string,
    } >,
    winners: Array< string > | null,
  } | null,
};

export type DeleteContestSpeakerMutationVariables = {
  contestId: string,
  speakerId: string,
};

export type DeleteContestSpeakerMutation = {
  deleteContestSpeaker:  {
    __typename: "Contest",
    publicId: string,
    status: ContestStatus,
    statusChangedAt: string,
    speakers:  Array< {
      __typename: "Speaker",
      id: string,
      name: string,
      wordOfTheDay: boolean,
      time: string | null,
      createdAt: string,
    } >,
    winners: Array< string > | null,
  } | null,
};

export type OpenContestForVotesMutationVariables = {
  contestId: string,
};

export type OpenContestForVotesMutation = {
  openContestForVotes:  {
    __typename: "Contest",
    publicId: string,
    status: ContestStatus,
    statusChangedAt: string,
    speakers:  Array< {
      __typename: "Speaker",
      id: string,
      name: string,
      wordOfTheDay: boolean,
      time: string | null,
      createdAt: string,
    } >,
    winners: Array< string > | null,
  } | null,
};

export type EndContestMutationVariables = {
  input: EndContestInput,
};

export type EndContestMutation = {
  endContest:  {
    __typename: "Contest",
    publicId: string,
    status: ContestStatus,
    statusChangedAt: string,
    speakers:  Array< {
      __typename: "Speaker",
      id: string,
      name: string,
      wordOfTheDay: boolean,
      time: string | null,
      createdAt: string,
    } >,
    winners: Array< string > | null,
  } | null,
};

export type CreateContestVoteMutationVariables = {
  input: CreateContestVoteInput,
};

export type CreateContestVoteMutation = {
  createContestVote:  {
    __typename: "ContestVoteEvent",
    contestPublicId: string,
  } | null,
};

export type UpdateContestVoteMutationVariables = {
  input: UpdateContestVoteInput,
};

export type UpdateContestVoteMutation = {
  updateContestVote:  {
    __typename: "ContestVoteEvent",
    contestPublicId: string,
  } | null,
};

export type FindContestQueryVariables = {
  id: string,
};

export type FindContestQuery = {
  findContestById:  {
    __typename: "Contest",
    publicId: string,
    status: ContestStatus,
    statusChangedAt: string,
    speakers:  Array< {
      __typename: "Speaker",
      id: string,
      name: string,
      wordOfTheDay: boolean,
      time: string | null,
      createdAt: string,
    } >,
    winners: Array< string > | null,
    votes:  Array< {
      __typename: "ContestVote",
      contestPublicId: string,
      voterName: string | null,
      createdAt: string,
      winners: Array< string > | null,
    } > | null,
  } | null,
};

export type FindContestByPublicIdQueryVariables = {
  publicId: string,
};

export type FindContestByPublicIdQuery = {
  findContestByPublicId:  {
    __typename: "Contest",
    publicId: string,
    status: ContestStatus,
    statusChangedAt: string,
    speakers:  Array< {
      __typename: "Speaker",
      id: string,
      name: string,
      wordOfTheDay: boolean,
      time: string | null,
      createdAt: string,
    } >,
    winners: Array< string > | null,
  } | null,
};

export type OnUpdateContestSubscriptionVariables = {
  contestPublicId: string,
};

export type OnUpdateContestSubscription = {
  onUpdateContest:  {
    __typename: "Contest",
    publicId: string,
    status: ContestStatus,
    statusChangedAt: string,
    speakers:  Array< {
      __typename: "Speaker",
      id: string,
      name: string,
      wordOfTheDay: boolean,
      time: string | null,
      createdAt: string,
    } >,
    winners: Array< string > | null,
  } | null,
};

export type OnContestVoteChangeSubscriptionVariables = {
  contestPublicId: string,
};

export type OnContestVoteChangeSubscription = {
  onContestVoteChange:  {
    __typename: "ContestVoteEvent",
    contestPublicId: string,
  } | null,
};

export type OnUpdatePublicContestSubscriptionVariables = {
  publicId: string,
};

export type OnUpdatePublicContestSubscription = {
  onUpdateContest:  {
    __typename: "Contest",
    publicId: string,
    status: ContestStatus,
    statusChangedAt: string,
    speakers:  Array< {
      __typename: "Speaker",
      id: string,
      name: string,
      wordOfTheDay: boolean,
      time: string | null,
      createdAt: string,
    } >,
    winners: Array< string > | null,
  } | null,
};

export type ContestOwnerProjectionFragment = {
  __typename: "Contest",
  publicId: string,
  status: ContestStatus,
  statusChangedAt: string,
  speakers:  Array< {
    __typename: "Speaker",
    id: string,
    name: string,
    wordOfTheDay: boolean,
    time: string | null,
    createdAt: string,
  } >,
  winners: Array< string > | null,
};

export type VoteFragment = {
  __typename: "ContestVote",
  contestPublicId: string,
  voterName: string | null,
  createdAt: string,
  winners: Array< string > | null,
};

export type ContestPublicProjectionFragment = {
  __typename: "Contest",
  publicId: string,
  status: ContestStatus,
  statusChangedAt: string,
  speakers:  Array< {
    __typename: "Speaker",
    id: string,
    name: string,
    wordOfTheDay: boolean,
    time: string | null,
    createdAt: string,
  } >,
  winners: Array< string > | null,
};
