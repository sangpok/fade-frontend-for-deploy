import { TVoteCandidateCard, TVoteResult } from '@Types/model';
import { generateRandomId } from '@Utils/index';
import { format } from 'date-fns';
import { create } from 'zustand';

export type SwipeDirection = 'left' | 'right';
interface VotingState {
  cycleId: string; // 현재 투표 사이클 Id
  viewCards: TVoteCandidateCard[]; // 현재 투표 선택지
  voteResults: TVoteResult[]; // 투표 결과를 담아놓는 곳
  hasVotedToday: boolean; // 오늘 투표를 진행했는지?
  isVotingInProgress: boolean; // 현재 투표 중인지?
  votingCountToday: number; // 오늘 투표한 횟수
  votingProgress: number; // 1부터 시작, 1: 1을 투표할 차례라는 뜻
  swipeDirection: SwipeDirection; // 애니메이션을 위한 스와이프 방향

  updateVoteResult: (voteResult: TVoteResult) => void;
  setVoteResults: (voteResults: TVoteResult[]) => void;
  clearVoteResults: () => void;

  setVotingCountToday: (votingCountToday: number) => void;
  addVotingCountToday: () => void;

  setVotingProgress: (votingProgress: number) => void;
  addVotingProgress: () => void;
  clearVotingProgress: () => void;

  setViewCards: (viewCards: TVoteCandidateCard[]) => void;
  setSwipeDirection: (swipeDirection: SwipeDirection) => void;

  setHasVotedToday: (hasVoted: boolean) => void;
  setIsVotingInProgress: (isInProgress: boolean) => void;

  generateNewCycleId: () => void;
  handleSelect: (swipeDirection: SwipeDirection) => void;
}

/**
 * 투표를 하다가 중간에 나갔다 들어오면 유지할 수 있도록
 * LocalStorage에 필요한 투표 정보를 담음
 * 해당 정보는 투표를 시작할 때 생성되며, 진행될 때 업데이트 되고, 끝나면 삭제된다.
 */

export interface TLocalVoteData {
  viewCards: TVoteCandidateCard[];
  voteResults: TVoteResult[];
}

const loadSavedVotingData = () => {
  const lastVotedAt = localStorage.getItem('FADE_LAST_VOTED_AT');
  const savedVoteData = localStorage.getItem('FADE_VOTE_DATA');

  const hasVotedToday = lastVotedAt === null ? false : lastVotedAt === format(new Date(), 'yyyy-MM-dd');
  const votingCountToday = lastVotedAt === null || hasVotedToday ? Number(localStorage.getItem('FADE_VOTE_COUNT') || 0) : 0; // 오늘 투표를 진행하지 않았지만(10번) 투표를 하고 있었을 수 있음.

  if (savedVoteData === null) {
    return { hasVotedToday, votingCountToday };
  }

  const voteData = JSON.parse(savedVoteData) as TLocalVoteData;

  return {
    hasVotedToday,
    isVotingInProgress: true,
    votingProgress: voteData.voteResults.length,
    votingCountToday,
    ...voteData,
  };
};

/** TODO: 나중에 votingProgress를 voteResuts로 계산하기 */

export const useVotingStore = create<VotingState>((set, get) => ({
  cycleId: generateRandomId(),
  viewCards: [],
  voteResults: [],
  isVotingInProgress: false,
  votingProgress: 1,
  swipeDirection: 'right',
  ...loadSavedVotingData(),

  updateVoteResult: (voteResult) => set(({ voteResults }) => ({ voteResults: [...voteResults, voteResult] })),
  setVoteResults: (voteResults) => set({ voteResults }),
  clearVoteResults: () => set({ voteResults: [] }),

  setVotingCountToday: (votingCountToday) => set({ votingCountToday }),
  addVotingCountToday: () => set(({ votingCountToday }) => ({ votingCountToday: votingCountToday + 1 })),

  setVotingProgress: (votingProgress) => set({ votingProgress }),
  addVotingProgress: () => set(({ votingProgress }) => ({ votingProgress: votingProgress + 1 })),
  clearVotingProgress: () => set({ votingProgress: 1 }),

  setViewCards: (viewCards) => set({ viewCards }),
  setSwipeDirection: (swipeDirection) => set({ swipeDirection }),

  setHasVotedToday: (hasVotedToday) => set({ hasVotedToday }),
  setIsVotingInProgress: (isVotingInProgress) => set({ isVotingInProgress }),

  generateNewCycleId: () => set({ cycleId: generateRandomId() }),

  handleSelect: (swipeDirection) => {
    const { viewCards, votingCountToday, setViewCards, setSwipeDirection, addVotingCountToday, addVotingProgress, updateVoteResult } = get();
    const currentViewCard = viewCards.at(-1);

    if (currentViewCard) {
      const newVoteResult: TVoteResult = {
        feedId: currentViewCard.feedId,
        voteType: swipeDirection === 'left' ? 'FADE_OUT' : 'FADE_IN',
      };

      const voteData = JSON.parse(localStorage.getItem('FADE_VOTE_DATA')!) as TLocalVoteData;
      localStorage.setItem('FADE_VOTE_DATA', JSON.stringify({ ...voteData, voteResults: [...voteData.voteResults, newVoteResult] } as TLocalVoteData));

      updateVoteResult(newVoteResult);
    }

    setViewCards(viewCards.slice(0, -1));
    setSwipeDirection(swipeDirection);

    addVotingProgress();
    addVotingCountToday();

    localStorage.setItem('FADE_VOTE_COUNT', String(votingCountToday + 1));
  },
}));
