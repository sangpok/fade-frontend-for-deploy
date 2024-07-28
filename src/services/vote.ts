import { axios } from '@Libs/axios';
import { TFeed, TVoteCandidateAPI, TVoteHistoryItem, TVoteHistoryItemAPI, TVoteResult } from '@Types/model';
import { VoteInfiniteResponse } from '@Types/response';

type GetVoteCandidatesAPIResponse = { feeds: TFeed[] };
type GetVoteCandidatesResponse = { voteCandidates: TVoteCandidateAPI[] };

export async function requestGetVoteCandidates() {
  return await axios.get<GetVoteCandidatesAPIResponse>('/vote/candidates').then(
    ({ data: { feeds } }) =>
      ({
        voteCandidates: feeds.map(({ id, ...feed }) => ({
          feedId: id,
          ...feed,
        })),
      }) as GetVoteCandidatesResponse
  );
}

type SendVoteResultPayload = TVoteResult[];

export async function requestSendVoteResult(voteItems: SendVoteResultPayload) {
  return await axios.post('/vote/candidates', { voteItems });
}

type GetVoteHistoryPayload = { nextCursor: string; scrollType: string };
type GetVoteHistoryResponseAPI = VoteInfiniteResponse<{ feeds: TVoteHistoryItemAPI[] }>;
type GetVoteHistoryResponse = VoteInfiniteResponse<{ feeds: TVoteHistoryItem[] }>;

export async function requestGetVoteHistory({ scrollType, nextCursor }: GetVoteHistoryPayload) {
  return await axios.get<GetVoteHistoryResponseAPI>(`/vote/history?limit=3&nextCursor=${nextCursor}&scrollType=${scrollType}`).then(
    ({ data: { feeds, ...rest } }) =>
      ({
        ...rest,
        feeds: feeds.map(({ styleIds, username, ...feed }) => ({
          ...feed,
          accountId: username,
          styleIds: styleIds.map(({ id }) => id),
        })),
      }) as GetVoteHistoryResponse
  );
}
