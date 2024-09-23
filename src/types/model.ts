/**
 * API에서 응답이 오는 모델은 Suffix로 DTO가 붙습니다.
 * 프론트에서 사용하는 모델은 Suffix없이 사용합니다.
 * 두 개를 작성 시 순서는 DTO를 작성하고 바로 프론트 모델을 작성합니다.
 *
 * API에서 오는 응답 그대로 사용할 시 Suffix 없이 사용합니다.
 */

export type GenderType = 'MALE' | 'FEMALE';

/**
 * 유저 정보 관련 모델
 */

export interface TUserDetail {
  id: number;
  username: string;
  profileImageURL?: string;
  genderType?: GenderType;
  subscribedCount?: number;
  introduceContent?: string;
  isSubscribed?: boolean;
}

export interface TMyUserDetail extends TUserDetail {
  selectedFAPCount: number;
  genderType: GenderType;
  subscribedCount: number;
  introduceContent: string;
  isSubscribed?: never;
}

export interface TFeedUserDetail extends TUserDetail {
  genderType: GenderType;
  subscribedCount: number;
  introduceContent: string;
  isSubscribed: boolean;
}

export interface TSubscriberDTO extends Pick<TUserDetail, 'id' | 'username' | 'profileImageURL'> {}
export interface TSubscriber extends Omit<TSubscriberDTO, 'id'> {
  userId: number;
}

export interface TMatchedUser extends Pick<TUserDetail, 'id' | 'username' | 'profileImageURL'> {}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Feed 관련 모델
 *
 * Feed 기본 모델은 다음과 같은 순서로 확장됨.
 * TFeedBase -> TFeedDetailBase -> TFAPArchivingFeed | TAllFashionFeed | TBookmarkFeed | TVoteHistoryFeed | TUserFeed | TMyFeed
 * TVoteCandidate는 Feed의 일부 타입을 쓰긴 하나 성격이 다르므로 Feed로 묶이지 않음.
 *
 * 여기에서 서버에서 직접 받는 데이터 타입은 DTO를 붙이며,
 * UI 모델을 위한 데이터 타입은 DTO를 붙이지 않음
 * (Ex. TMyFeedDTO, TMyFeed )
 *
 * DTO의
 * */

export interface TFeedBase {
  id: number;
  memberId: number;
  imageURL: string;
  styleIds: TStyleId[];
  outfits: TOutfitItem[];
  createdAt: Date;
}

export interface TStyleId {
  id: number;
}

export interface TOutfitItem {
  id: number;
  brandName: string;
  details: string;
  categoryId: number;
}

export interface TFeedDetailBaseDTO extends TFeedBase, Pick<TUserDetail, 'username' | 'profileImageURL'> {
  isFAPFeed: boolean;
  isSubscribed: boolean;
  isBookmarked: boolean;
  isMine: boolean;

  votedAt?: Date;
  fapSelectedAt?: Date;
}

interface TFeedDetailBase extends Omit<TFeedDetailBaseDTO, 'styleIds'> {
  styleIds: number[];
}

export interface TFeedAdittionalDetail {
  fadeInCount: number;
  bookmarkCount: number;
  reportCount: number;
}

export interface TVoteCandidateDTO extends Omit<TFeedDetailBaseDTO, 'styleIds' | 'isFAPFeed' | 'isMine'> {}
export interface TVoteCandidate extends Omit<TVoteCandidateDTO, 'id'> {
  feedId: number;
}

export interface TVoteCandidateCard extends TVoteCandidate {
  anonName: string;
}

export interface TVoteResult {
  feedId: number;
  voteType: VoteType;
}

export type VoteType = 'FADE_IN' | 'FADE_OUT';

export interface TFAPArchivingFeedDTO extends TFeedDetailBaseDTO {
  isFAPFeed: true;
  fapSelectedAt: Date;
}

export interface TFAPArchivingFeed extends Omit<TFAPArchivingFeedDTO, 'styleIds'> {
  styleIds: number[];
}

export interface TAllFashionFeedDTO extends TFeedDetailBaseDTO {}
export interface TAllFashionFeed extends Omit<TAllFashionFeedDTO, 'styleIds'> {
  styleIds: number[];
}

export interface TSubscribeFeedDTO extends TFeedDetailBaseDTO {
  isMine: false;
  isSubscribed: true;
}

export interface TSubscribeFeed extends Omit<TSubscribeFeedDTO, 'styleIds'> {
  styleIds: number[];
}

export interface TBookmarkFeedDTO extends TFeedDetailBaseDTO {
  isBookmarked: true;
}

export interface TBookmarkFeed extends Omit<TBookmarkFeedDTO, 'styleIds'> {
  styleIds: number[];
}

export interface TMyFeedDTO extends TFeedDetailBaseDTO, TFeedAdittionalDetail {
  isMine: true;
  isSubscribed: false;
}

export interface TMyFeed extends Omit<TMyFeedDTO, 'styleIds'> {
  styleIds: number[];
}

export interface TUserFeedDTO extends TFeedDetailBaseDTO {}
export interface TUserFeed extends Omit<TUserFeedDTO, 'styleIds'> {
  styleIds: number[];
}

export interface TVoteHistoryFeedDTO extends TFeedDetailBaseDTO {
  voteType: 'FADE_IN' | 'FADE_OUT';
  votedAt: Date;
}

export interface TVoteHistoryFeed extends Omit<TVoteHistoryFeedDTO, 'styleIds'> {
  styleIds: number[];
}

export type TFeedDTO = TFeedDetailBaseDTO | TFAPArchivingFeedDTO | TAllFashionFeedDTO | TMyFeedDTO | TVoteHistoryFeedDTO;
export type TFeed = TFeedDetailBase | TFAPArchivingFeed | TAllFashionFeed | TMyFeed | TVoteHistoryFeed;

export function isTMyFeed(feedDetail: TFeed): feedDetail is TMyFeed {
  return feedDetail.isMine;
}

export function isTVoteHistoryFeed(feedDetail: TFeed): feedDetail is TVoteHistoryFeed {
  return feedDetail.votedAt !== undefined;
}

export function TFAPArchivingFeed(feedDetail: TFeed): feedDetail is TFAPArchivingFeed {
  return feedDetail.fapSelectedAt !== undefined;
}

/**
 * TFeedBase
 *  TVoteCandidate
 *    TVoteCandidateCard
 *  TFAPArchivingFeed
 */

/** Buy or Not 목록 아이템 */
export interface TBoNItem {
  id: number;
  title: string;
  imageURL: string;
  voteCount: number;
  commentCount: number;
  hasVoted: boolean;
  isHot: boolean;
  isMine: boolean;
  createdAt: Date;
}

/** Buy or Not 본문 */
export interface TBoNDetail {
  title: string;
  contents: string;
  imageURL: string;
  voteCount: number;
  commentCount: number;
  myVotedValue: BoNVotedValue;
  bonCount: TBoNCount;
  hasCommented: boolean;
  isMine: boolean;
}

export type BoNVotedValue = 'YES' | 'NO' | 'NOT';

export interface TBoNCount {
  yes: number;
  no: number;
}

/** Buy or Not 댓글 */
export interface TBoNComment {
  id: number;
  votedValue: BoNCommentVotedValue;
  anonName: string;
  contents: string;
  likeCount: number;
  hasLiked: boolean;
  isBestComment: boolean;
  isMine: boolean;
  createdAt: Date;
}

export type BoNCommentVotedValue = Omit<BoNVotedValue, 'NOT'>;
