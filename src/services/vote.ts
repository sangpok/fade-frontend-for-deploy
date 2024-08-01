import { axios } from '@Libs/axios';
import { TVoteCandidate, TVoteCandidateDTO, TVoteHistoryFeed, TVoteHistoryFeedDTO, TVoteResult } from '@Types/model';
import { VoteInfiniteResponse } from '@Types/response';

type GetVoteCandidatesAPIResponse = { feeds: TVoteCandidateDTO[] };
type GetVoteCandidatesResponse = { voteCandidates: TVoteCandidate[] };

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

type GetVoteHistoryPayload = { nextCursor?: string | null; scrollType: string; limit?: number };
type GetVoteHistoryResponseAPI = VoteInfiniteResponse<{ feeds: TVoteHistoryFeedDTO[] }>;
export type GetVoteHistoryResponse = VoteInfiniteResponse<{ feeds: TVoteHistoryFeed[] }>;

export async function requestGetVoteHistory({ scrollType, nextCursor, limit = 3 }: GetVoteHistoryPayload) {
  return await axios
    .get<GetVoteHistoryResponseAPI>(
      `/vote/history?limit=${limit}&scrollType=${scrollType}${nextCursor !== undefined && nextCursor !== null ? `&nextCursor=${nextCursor}` : ''}`
    )
    .then(
      ({ data: { feeds, ...rest } }) =>
        ({
          ...rest,
          feeds: feeds.map(({ styleIds, ...feed }) => ({
            ...feed,
            styleIds: styleIds.map(({ id }) => id),
          })),
        }) as GetVoteHistoryResponse
    );
}
