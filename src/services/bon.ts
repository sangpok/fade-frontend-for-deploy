import { axios } from '@Libs/axios';
import { BoNVotedValue, TBoNComment, TBoNDetail, TBoNItem } from '@Types/model';

type GetBoNListPayload = { sort: string; searchType: string; nextCursor: number; size: number };
type GetBoNListResponse = { bonList: TBoNItem[]; nextCursor: number };

export async function requestGetBoNList({ nextCursor, searchType = 'all', size = 10, sort = 'recent' }: GetBoNListPayload) {
  const searchParamsRaw = { searchType: searchType.toUpperCase(), size: size.toString(), sort: sort.toUpperCase() };
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
type CreateBoNResponse = { bonId: number };

export async function requestCreateBoN(payload: CreateBoNPayload) {
  return await axios.post<CreateBoNResponse>(`/bon`, payload);
}

type GetBoNCommentPayload = { bonId: number; type: string; cursor: number; limit: number };
type GetBoNCommentResponse = { comments: TBoNComment[]; nextCursor: number };

export async function requestGetBoNComment({ bonId, cursor, limit = 10, type = 'default' }: GetBoNCommentPayload) {
  const searchParamsRaw = { cursor: cursor.toString(), limit: limit.toString(), type };
  const searchParams = new URLSearchParams(Object.entries(searchParamsRaw)).toString();

  return await axios.get<GetBoNCommentResponse>(`/bon/${bonId}/comment?${searchParams}`);
}

type VoteBoNPayload = { bonId: number; votedValue: BoNVotedValue };
type VoteBoNResponse = { bonId: number };

export async function requestVoteBoN({ bonId, votedValue }: VoteBoNPayload) {
  return await axios.post<VoteBoNResponse>(`/bon/${bonId}/votes`, { bonVoteType: votedValue });
}

type AddBoNCommentPayload = { bonId: number; content: string };
type AddBoNCommentResponse = { bonId: number };

export async function requestAddBoNComment({ bonId, content }: AddBoNCommentPayload) {
  return await axios.post<AddBoNCommentResponse>(`/bon/${bonId}/comment`, { content });
}

type LikeBoNCommentPayload = { bonId: number; commentId: number; doesLike: boolean };
type LikeBoNCommentResponse = { commentId: number };

export async function requestLikeBoNComment({ bonId, commentId, doesLike }: LikeBoNCommentPayload) {
  if (doesLike) {
    return await axios.post<LikeBoNCommentResponse>(`/bon/${bonId}/comment/${commentId}`);
  }

  return await axios.delete<LikeBoNCommentResponse>(`/bon/${bonId}/comment/${commentId}`);
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
