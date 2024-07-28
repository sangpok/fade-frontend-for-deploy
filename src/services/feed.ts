import { axios } from '@Libs/axios';
import { FilterType } from '@Pages/Root/archive/components/SelectFilterDialog';
import { TAllFashionFeed, TAllFashionFeedAPI, TFAPArchivingFeed, TFAPArchivingFeedAPI, TFeedDetail, TFeedDetailAPI } from '@Types/model';
import { InfiniteResponse } from '@Types/response';
import { objectToQueryParam } from '@Utils/index';

type OutfitField = {
  categoryId: number;
  brandName: string;
  details: string;
};

type CreateFeedPayload = { attachmentId: number; outfits: OutfitField[]; styleIds: number[] };
type CreateFeedResponse = { feedId: number };

export async function requestCreateFeed(payload: CreateFeedPayload) {
  return await axios.post<CreateFeedResponse>(`/feeds`, payload);
}

type BookmarkFeedPayload = { feedId: number; wouldBookmark: boolean };
type BookmarkFeedResponse = null;

export async function requestBookmarkFeed({ feedId, wouldBookmark }: BookmarkFeedPayload) {
  if (wouldBookmark) {
    return await axios.post<BookmarkFeedResponse>(`/bookmark/${feedId}`, {});
  }

  return await axios.delete<BookmarkFeedResponse>(`/bookmark/${feedId}`, {});
}

type FAPArchivingPayload = { selectedDate: string };
type FAPArchivingResponseAPI = { feeds: TFAPArchivingFeedAPI[] };
type FAPArchivingResponse = { feeds: TFAPArchivingFeed[] };

export async function requestFAPArchiving({ selectedDate }: FAPArchivingPayload) {
  return await axios.get<FAPArchivingResponseAPI>(`/archiving?selectedDate=${selectedDate}`).then(
    ({ data: { feeds } }) =>
      ({
        feeds: feeds.map(({ id, styleIds, ...feed }) => ({
          feedId: id,
          styleIds: styleIds.map(({ id }) => id),
          ...feed,
        })),
      }) as FAPArchivingResponse
  );
}

type GetAllFashionFeedPayload = { filters: FilterType; nextCursor: number };
type GetAllFashionFeedResponseAPI = InfiniteResponse<{ feeds: TAllFashionFeedAPI[] }>;
type GetAllFashionFeedResponse = InfiniteResponse<{ feeds: TAllFashionFeed[] }>;

export async function requestGetAllFashionFeed({ filters, nextCursor }: GetAllFashionFeedPayload) {
  return await axios.get<GetAllFashionFeedResponseAPI>(`/feeds?limit=12&nextCursor=${nextCursor}&${objectToQueryParam(filters)}`).then(
    ({ data: { feeds, nextCursor } }) =>
      ({
        nextCursor,
        feeds: feeds.map(({ id, styleIds, ...feed }) => ({
          feedId: id,
          styleIds: styleIds.map(({ id }) => id),
          ...feed,
        })),
      }) as GetAllFashionFeedResponse
  );
}

type GetSubscribeFeedsPayload = { nextCursor: number };
type GetSubscribeFeedsResponseAPI = InfiniteResponse<{ feeds: TFeedDetailAPI[] }>;
type GetSubscribeFeedsResponse = InfiniteResponse<{ feeds: TFeedDetail[] }>;

export async function requestGetSubscribeFeeds({ nextCursor }: GetSubscribeFeedsPayload) {
  return await axios.get<GetSubscribeFeedsResponseAPI>(`/feeds?fetchingType=SUBSCRIBE&limit=12&nextCursor=${nextCursor}`).then(
    ({ data: { feeds, nextCursor } }) =>
      ({
        nextCursor,
        feeds: feeds.map(({ id, styleIds, ...feed }) => ({
          feedId: id,
          styleIds: styleIds.map(({ id }) => id),
          accountId: feed.username,
          ...feed,
        })),
      }) as GetSubscribeFeedsResponse
  );
}

type GetUserFeedsPayload = { userId: number; nextCursor: number };
type GetUserFeedsResponseAPI = InfiniteResponse<{ feeds: TFeedDetailAPI[] }>;
type GetUserFeedsResponse = InfiniteResponse<{ feeds: TFeedDetail[] }>;

export async function requestGetUserFeeds({ userId, nextCursor }: GetUserFeedsPayload) {
  return await axios.get<GetUserFeedsResponseAPI>(`/feeds?limit=12&nextCursor=${nextCursor}&memberId=${userId}`).then(
    ({ data: { feeds, nextCursor } }) =>
      ({
        nextCursor,
        feeds: feeds.map(({ id, styleIds, ...feed }) => ({
          feedId: id,
          styleIds: styleIds.map(({ id }) => id),
          accountId: feed.username,
          ...feed,
        })),
      }) as GetUserFeedsResponse
  );
}

type GetBookmarkFeedsPayload = { userId: number; nextCursor: number };
type GetBookmarkFeedsResponseAPI = InfiniteResponse<{ feeds: TFeedDetailAPI[] }>;
type GetBookmarkFeedsResponse = InfiniteResponse<{ feeds: TFeedDetail[] }>;

export async function requestGetBookmarkFeeds({ userId, nextCursor }: GetBookmarkFeedsPayload) {
  return await axios.get<GetBookmarkFeedsResponseAPI>(`/feeds?fetchingType=BOOKMARK&limit=12&nextCursor=${nextCursor}&memberId=${userId}`).then(
    ({ data: { feeds, nextCursor } }) =>
      ({
        nextCursor,
        feeds: feeds.map(({ id, styleIds, ...feed }) => ({
          feedId: id,
          styleIds: styleIds.map(({ id }) => id),
          accountId: feed.username,
          ...feed,
        })),
      }) as GetBookmarkFeedsResponse
  );
}
