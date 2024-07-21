import { create } from 'zustand';

export type FashionCard = {
  userId: string;
  imageURL: string;
};

export type SwipeDirection = 'left' | 'right';

interface VotingState {
  viewCards: FashionCard[]; // 현재 투표 선택지
  hasVotedToday: boolean; // 오늘 투표를 진행했는지?
  isVotingInProgress: boolean; // 현재 투표 중인지?
  votingCountToday: number; // 오늘 투표한 횟수
  votingProgress: number; // 1부터 시작, 1: 1을 투표할 차례라는 뜻
  swipeDirection: SwipeDirection; // 애니메이션을 위한 스와이프 방향

  setViewCards: (viewCards: FashionCard[]) => void;
  setHasVotedToday: (hasVoted: boolean) => void;
  setIsVotingInProgress: (isInProgress: boolean) => void;
  addVotingCountToday: () => void;
  addVotingProgress: () => void;
  clearVotingProgress: () => void;
  setSwipeDirection: (swipeDirection: SwipeDirection) => void;

  handleSelect: (swipeDirection: SwipeDirection) => void;
}

export const useVotingStore = create<VotingState>((set, get) => ({
  viewCards: [],
  hasVotedToday: false,
  isVotingInProgress: false,
  votingCountToday: 0,
  votingProgress: 1,
  swipeDirection: 'right',

  setViewCards: (viewCards) => set({ viewCards }),
  setHasVotedToday: (hasVotedToday) => set({ hasVotedToday }),
  setIsVotingInProgress: (isVotingInProgress) => set({ isVotingInProgress }),
  addVotingCountToday: () => set(({ votingCountToday }) => ({ votingCountToday: votingCountToday + 1 })),
  addVotingProgress: () => set(({ votingProgress }) => ({ votingProgress: votingProgress + 1 })),
  clearVotingProgress: () => set({ votingProgress: 1 }),
  setSwipeDirection: (swipeDirection) => set({ swipeDirection }),

  handleSelect: (swipeDirection) => {
    const { viewCards, setViewCards, setSwipeDirection, addVotingCountToday, addVotingProgress } = get();

    setViewCards(viewCards.slice(0, -1));
    setSwipeDirection(swipeDirection);

    addVotingProgress();
    addVotingCountToday();
  },
}));
