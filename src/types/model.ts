export type GenderType = 'MALE' | 'FEMALE';

export interface UserDetail {
  id: number;
  accountId: string;
  profileImageURL?: string;
  genderType?: GenderType;
}

export interface AuthTokens {
  accessToken: string;
  csrfToken?: string; // 보류
}

export interface TFeed {
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

export interface TVoteCandidateAPI extends Omit<TFeed, 'id'> {
  feedId: number;
  isSubscribed: boolean;
  isBookmarked: boolean;
}

export interface TVoteCandidate extends Omit<TFeed, 'id' | 'styleIds'> {
  feedId: number;
  styleIds: number[];
  isSubscribed: boolean;
  isBookmarked: boolean;
}

export interface TVoteCandidateCard extends TVoteCandidate {
  anonName: string;
}

export interface TVoteResult {
  feedId: number;
  voteType: VoteType;
}

export type VoteType = 'FADE_IN' | 'FADE_OUT';

export interface TFAPArchivingFeed extends Omit<TFeed, 'id' | 'styleIds'> {
  feedId: number;
  accountId: string;

  isSubscribed: boolean;
  isBookmarked: boolean;

  outfits: TOutfitItem[];
  styleIds: number[];

  createdAt: Date;
}

export interface TFAPArchivingFeedAPI extends TFeed {
  accountId: string;

  isSubscribed: boolean;
  isBookmarked: boolean;

  outfits: TOutfitItem[];
  styleIds: TStyleId[];

  createdAt: Date;
}

export interface TAllFashionFeedAPI extends TFeed {
  username: string;
}
export interface TAllFashionFeed extends Omit<TFeed, 'id' | 'styleIds'> {
  feedId: number;
  styleIds: number[];
}

interface TFeedDetailBase extends Omit<TFeed, 'id' | 'styleIds' | 'username'> {
  accountId: string;
  profileImageURL: string;

  feedId: number;
  styleIds: number[];

  isFAPFeed: boolean;
  isSubscribed: boolean;
  isBookmarked: boolean;
  isMine: boolean;

  votedAt?: Date;
}

interface TFeedDetailBaseAPI extends TFeed {
  username: string;
  profileImageURL: string;

  isFAPFeed: boolean;
  isSubscribed: boolean;
  isBookmarked: boolean;
  isMine: boolean;

  votedAt?: Date;
}

interface TFeedDetailMine extends TFeedDetailBase, TFeedAdittionalDetail {
  isMine: true;
  isSubscribed: never;
}

interface TFeedDetailMineAPI extends TFeedDetailBaseAPI, TFeedAdittionalDetail {
  isMine: true;
  isSubscribed: never;
}

export interface TFeedAdittionalDetail {
  fadeInCount: number;
  bookmarkCount: number;
  reportCount: number;
}

interface TFeedDetailVote extends TFeedDetailBase {
  votedAt: Date;
}

interface TFeedDetailVoteAPI extends TFeedDetailBaseAPI {
  votedAt: Date;
}

export type TFeedDetail = TFeedDetailBase | TFeedDetailMine | TFeedDetailVote;
export type TFeedDetailAPI = TFeedDetailBaseAPI | TFeedDetailMineAPI | TFeedDetailVoteAPI;

export function isTFeedDetailMine(feedDetail: TFeedDetail): feedDetail is TFeedDetailMine {
  return feedDetail.isMine;
}

export function isTFeedDetailVote(feedDetail: TFeedDetail): feedDetail is TFeedDetailVote {
  return feedDetail.votedAt !== undefined;
}

export interface TSubscriberAPI {
  id: number;
  username: string;
  profileImageURL: string;
}

export interface TSubscriber {
  userId: number;
  accountId: string;
  profileImageURL: string;
}

export interface TFeedUserDetailAPI {
  id: number;
  username: string;
  profileImageURL: string;
  subscribedCount: number;
  introduceContent: string;
  isSubscribed: boolean;
}

export interface TFeedUserDetail {
  userId: number;
  accountId: string;
  profileImageURL: string;
  subscribedCount: number;
  introduceContent: string;
  isSubscribed: boolean;
}

/**
 * TFeed
 *  TVoteCandidate
 *    TVoteCandidateCard
 *  TFAPArchivingFeed
 */

export interface TVoteHistoryItemAPI extends Omit<TFeedDetailBaseAPI, 'imageURL' | 'id'> {
  feedId: number;
  feedImageURL: string;
  voteType: 'FADE_IN' | 'FADE_OUT';
  votedAt: Date;
}

export interface TVoteHistoryItem extends Omit<TFeedDetailBase, 'imageURL'> {
  feedImageURL: string;
  voteType: 'FADE_IN' | 'FADE_OUT';
  votedAt: Date;
}
