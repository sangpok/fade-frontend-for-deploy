export type InfiniteResponse<T> = {
  nextCursor: number;
} & T;

export type VoteInfiniteResponse<T> = {
  nextCursorToUpScroll: string;
  nextCursorToDownScroll: string;
  direction: string;
} & T;
