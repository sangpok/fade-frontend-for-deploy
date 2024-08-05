import { axios } from '@Libs/axios';
import { TFeedUserDetail, TMatchedUser, TMyUserDetail, TSubscriber, TSubscriberDTO } from '@Types/model';
import { InfiniteResponse } from '@Types/response';

type UpdateUserDetailsPayload = Partial<Pick<TMyUserDetail, 'username' | 'profileImageURL' | 'introduceContent'>>;
type UpdateUserDetailsResponse = '';

/** 유저 정보 변경 요청 */
export async function requestUpdateUserDetails(payload: UpdateUserDetailsPayload) {
  return await axios.patch<UpdateUserDetailsResponse>(`/members/me`, payload);
}

type RequestSubscribeMemberPayload = { toMemberId: number; wouldSubscribe: boolean };
type RequestSubscribeMemberResponse = null;

export async function requestSubscribeMember({ toMemberId, wouldSubscribe }: RequestSubscribeMemberPayload) {
  if (wouldSubscribe) {
    return await axios.post<RequestSubscribeMemberResponse>(`/subscribe/${toMemberId}`, {});
  }

  return await axios.delete<RequestSubscribeMemberResponse>(`/subscribe/${toMemberId}`, {});
}

type RequestGetSubscribersPayload = { nextCursor: number };
type RequestGetSubscribersResponseAPI = InfiniteResponse<{ subscribers: TSubscriberDTO[]; totalSubscribers: number }>;
type RequestGetSubscribersResponse = InfiniteResponse<{ subscribers: TSubscriber[]; totalSubscribers: number }>;

export async function requestGetSubscribers({ nextCursor }: RequestGetSubscribersPayload) {
  return await axios.get<RequestGetSubscribersResponseAPI>(`/subscribe/subscribers${nextCursor !== -1 ? `?nextCursor=${nextCursor}` : ''}`).then(
    ({ data: { subscribers, nextCursor, totalSubscribers } }) =>
      ({
        subscribers: subscribers.map(
          ({ id, ...rest }) =>
            ({
              ...rest,
              userId: id,
            }) as TSubscriber
        ),
        nextCursor,
        totalSubscribers,
      }) as RequestGetSubscribersResponse
  );
}

type RequestGetFeedUserDetailsPayload = { userId: number };
// type RequestGetFeedUserDetailsResponseAPI = { details: TFeedUserDetail };
type RequestGetFeedUserDetailsResponse = TFeedUserDetail;

export async function requestGetFeedUserDetails({ userId }: RequestGetFeedUserDetailsPayload) {
  return await axios.get<RequestGetFeedUserDetailsResponse>(`/members/${userId}`);
}

// type RequestGetMyDetailsPayload = null
type RequestGetMyDetailsResponse = TMyUserDetail;

export async function requestGetMyDetails() {
  return await axios.get<RequestGetMyDetailsResponse>(`/members/me`);
}

type RequestSearchUserPayload = { username: string };
type RequestSearchUserResponse = { matchedMembers: TMatchedUser[] };

export async function requestSearchUser({ username }: RequestSearchUserPayload) {
  return await axios.get<RequestSearchUserResponse>(`/members/search?query=${username}`);
}

// type RequestSearchUserPayload = { username: string };
// type RequestSearchUserResponse = { matchedMembers: TMatchedUser[] };

export async function requestResignService() {
  return await axios.delete(`/members/me`);
}
