import { axios } from '@Libs/axios';
import { TNotification } from '@Types/notification';
import { InfiniteResponse } from '@Types/response';

type RequestGetNotificationsPayload = { nextCursor: number; limit?: number };
type RequestGetNotificationsResponse = InfiniteResponse<{ notifications: TNotification[] }>;

export async function requestGetNotifications({ nextCursor, limit = 10 }: RequestGetNotificationsPayload) {
  return await axios.get<RequestGetNotificationsResponse>(`/notifications?limit=${limit}${nextCursor !== -1 ? `&nextCursor=${nextCursor}` : ''}`);
}

// type RequestReadNotificationsPayload = null
// type RequestReadNotificationsResponse = void

export async function requestReadAllNotifications() {
  return await axios.post(`/notifications/read`, {});
}
