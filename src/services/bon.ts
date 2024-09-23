import { axios } from '@Libs/axios';
import { BoNVotedValue, TBoNComment, TBoNDetail, TBoNItem } from '@Types/model';

type GetBoNListPayload = { sortType: string; searchType: string; nextCursor: number; limit: number };
type GetBoNListResponse = { bonList: TBoNItem[]; nextCursor: number };

export async function requestGetBoNList({ nextCursor, searchType = 'all', limit = 10, sortType = 'recent' }: GetBoNListPayload) {
  const searchParamsRaw = { searchType: searchType.toUpperCase(), limit: limit.toString(), sortType: sortType.toUpperCase() };
  const searchParams = new URLSearchParams(Object.entries(searchParamsRaw));

  if (nextCursor !== -1) {
    searchParams.append('nextCursor', nextCursor.toString());
  }

  return await axios.get<GetBoNListResponse>(`/bon?${searchParams.toString()}`);
}

type GetBoNDetailPayload = { bonId: number };
type GetBoNDetailResponse = TBoNDetail;

export async function requestGetBoNDetail({ bonId }: GetBoNDetailPayload) {
  return await axios.get<GetBoNDetailResponse>(`/bon/${bonId}`);
}

type CreateBoNPayload = { attachmentId: number; title: string; contents: string };
type CreateBoNResponse = { id: number };

export async function requestCreateBoN(payload: CreateBoNPayload) {
  return await axios.post<CreateBoNResponse>(`/bon`, payload);
}

type GetBoNCommentPayload = { bonId: number; searchType: string; nextCursor: number; limit: number };
type GetBoNCommentResponse = { comments: TBoNComment[]; nextCursor: number };

export async function requestGetBoNComment({ bonId, nextCursor, limit = 10, searchType = 'all' }: GetBoNCommentPayload) {
  const searchParamsRaw = { limit: limit.toString(), searchType: searchType.toUpperCase() };
  const searchParams = new URLSearchParams(Object.entries(searchParamsRaw));

  if (nextCursor !== -1) {
    searchParams.append('nextCursor', nextCursor.toString());
  }

  return await axios.get<GetBoNCommentResponse>(`/bon/${bonId}/comment?${searchParams.toString()}`);
}

type VoteBoNPayload = { bonId: number; votedValue: BoNVotedValue };
type VoteBoNResponse = { bonId: number };

export async function requestVoteBoN({ bonId, votedValue }: VoteBoNPayload) {
  return await axios.post<VoteBoNResponse>(`/bon/${bonId}/votes`, { bonVoteType: votedValue });
}

type AddBoNCommentPayload = { bonId: number; contents: string };
type AddBoNCommentResponse = { bonId: number };

export async function requestAddBoNComment({ bonId, contents }: AddBoNCommentPayload) {
  return await axios.post<AddBoNCommentResponse>(`/bon/${bonId}/comment`, { content: contents });
}

type LikeBoNCommentPayload = { bonId: number; commentId: number; doesLike: boolean };
type LikeBoNCommentResponse = { commentId: number };

export async function requestLikeBoNComment({ bonId, commentId, doesLike }: LikeBoNCommentPayload) {
  if (doesLike) {
    return await axios.post<LikeBoNCommentResponse>(`/bon/${bonId}/comment/${commentId}/like`);
  }

  return await axios.delete<LikeBoNCommentResponse>(`/bon/${bonId}/comment/${commentId}/like`);
}

type DeleteBoNPayload = { bonId: number };
type DeleteBoNResponse = { bonId: number };

export async function requestDeleteBoN({ bonId }: DeleteBoNPayload) {
  return await axios.delete<DeleteBoNResponse>(`/bon/${bonId}`);
}

type DeleteBoNCommentPayload = { bonId: number; commentId: number };
type DeleteBoNCommentResponse = { commentId: number };

export async function requestDeleteBoNComment({ bonId, commentId }: DeleteBoNCommentPayload) {
  return await axios.delete<DeleteBoNCommentResponse>(`/bon/${bonId}/comment/${commentId}`);
}
