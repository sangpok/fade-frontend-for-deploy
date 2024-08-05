import { axios } from '@Libs/axios';
import { FilterType } from '@Pages/Root/archive/components/SelectFilterDialog';
import {
  TAllFashionFeed,
  TAllFashionFeedDTO,
  TBookmarkFeed,
  TBookmarkFeedDTO,
  TFAPArchivingFeed,
  TFAPArchivingFeedDTO,
  TMyFeed,
  TMyFeedDTO,
  TOutfitItem,
  TSubscribeFeed,
  TSubscribeFeedDTO,
  TUserFeed,
  TUserFeedDTO,
} from '@Types/model';
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
type FAPArchivingResponseAPI = { feeds: TFAPArchivingFeedDTO[] };
type FAPArchivingResponse = { feeds: TFAPArchivingFeed[] };

export async function requestFAPArchiving({ selectedDate }: FAPArchivingPayload) {
  return await axios.get<FAPArchivingResponseAPI>(`/archiving?selectedDate=${selectedDate}`).then(
    ({ data: { feeds } }) =>
      ({
        feeds: feeds.map(({ styleIds, ...feed }) => ({
          styleIds: styleIds.map(({ id }) => id),
          ...feed,
        })),
      }) as FAPArchivingResponse
  );
}

type GetAllFashionFeedPayload = { filters: FilterType; nextCursor: number };
type GetAllFashionFeedResponseAPI = InfiniteResponse<{ feeds: TAllFashionFeedDTO[] }>;
type GetAllFashionFeedResponse = InfiniteResponse<{ feeds: TAllFashionFeed[] }>;

export async function requestGetAllFashionFeed({ filters, nextCursor }: GetAllFashionFeedPayload) {
  const filterQuerys = objectToQueryParam(filters);

  return await axios
    .get<GetAllFashionFeedResponseAPI>(`/feeds?limit=12&${nextCursor !== -1 ? `nextCursor=${nextCursor}` : ''}${filterQuerys !== '' ? `&${filterQuerys}` : ''}`)
    .then(
      ({ data: { feeds, nextCursor } }) =>
        ({
          nextCursor,
          feeds: feeds.map(({ styleIds, ...feed }) => ({
            styleIds: styleIds.map(({ id }) => id),
            ...feed,
          })),
        }) as GetAllFashionFeedResponse
    );
}

type GetSubscribeFeedsPayload = { nextCursor: number };
type GetSubscribeFeedsResponseAPI = InfiniteResponse<{ feeds: TSubscribeFeedDTO[] }>;
type GetSubscribeFeedsResponse = InfiniteResponse<{ feeds: TSubscribeFeed[] }>;

export async function requestGetSubscribeFeeds({ nextCursor }: GetSubscribeFeedsPayload) {
  return await axios.get<GetSubscribeFeedsResponseAPI>(`/feeds?fetchTypes=SUBSCRIBE&limit=12${nextCursor !== -1 ? `&nextCursor=${nextCursor}` : ''}`).then(
    ({ data: { feeds, nextCursor } }) =>
      ({
        nextCursor,
        feeds: feeds.map(({ styleIds, ...feed }) => ({
          styleIds: styleIds.map(({ id }) => id),
          ...feed,
        })),
      }) as GetSubscribeFeedsResponse
  );
}

type GetUserFeedsPayload = { userId: number; nextCursor: number };
type GetUserFeedsResponseAPI = InfiniteResponse<{ feeds: TUserFeedDTO[] }>;
type GetUserFeedsResponse = InfiniteResponse<{ feeds: TUserFeed[] }>;

export async function requestGetUserFeeds({ userId, nextCursor }: GetUserFeedsPayload) {
  return await axios.get<GetUserFeedsResponseAPI>(`/feeds?limit=12&memberId=${userId}${nextCursor !== -1 ? `&nextCursor=${nextCursor}` : ''}`).then(
    ({ data: { feeds, nextCursor } }) =>
      ({
        nextCursor,
        feeds: feeds.map(({ styleIds, ...feed }) => ({
          styleIds: styleIds.map(({ id }) => id),
          ...feed,
        })),
      }) as GetUserFeedsResponse
  );
}

type GetBookmarkFeedsPayload = { nextCursor: number };
type GetBookmarkFeedsResponseAPI = InfiniteResponse<{ feeds: TBookmarkFeedDTO[] }>;
type GetBookmarkFeedsResponse = InfiniteResponse<{ feeds: TBookmarkFeed[] }>;

export async function requestGetBookmarkFeeds({ nextCursor }: GetBookmarkFeedsPayload) {
  return await axios.get<GetBookmarkFeedsResponseAPI>(`/feeds?fetchTypes=BOOKMARK&limit=12${nextCursor !== -1 ? `&nextCursor=${nextCursor}` : ''}`).then(
    ({ data: { feeds, nextCursor } }) =>
      ({
        nextCursor,
        feeds: feeds.map(({ styleIds, ...feed }) => ({
          styleIds: styleIds.map(({ id }) => id),
          ...feed,
        })),
      }) as GetBookmarkFeedsResponse
  );
}

type GetFeedDetailsPayload = { feedId: number };
type GetFeedDetailsResponseAPI = TMyFeedDTO;
type GetFeedDetailsResponse = TMyFeed;

export async function requestGetFeedDetails({ feedId }: GetFeedDetailsPayload) {
  return await axios.get<GetFeedDetailsResponseAPI>(`/feeds/${feedId}`).then(
    (response) =>
      ({
        ...response.data,
        styleIds: response.data.styleIds.map(({ id }) => id),
      }) as GetFeedDetailsResponse
  );
}

type DeleteMyFeedPayload = { feedId: number };

export async function requestDeleteMyFeed({ feedId }: DeleteMyFeedPayload) {
  return await axios.delete(`/feeds/${feedId}`, {});
}

type UpdateMyFeedPayload = { feedId: number; outfits: Omit<TOutfitItem, 'id'>[]; styleIds: number[] };

export async function requestUpdateMyFeed({ feedId, ...rest }: UpdateMyFeedPayload) {
  return await axios.patch(`/feeds/${feedId}`, rest);
}
