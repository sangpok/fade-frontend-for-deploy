import { BookmarkButton } from '@Components/BookmarkButton';
import { ReportButton } from '@Components/ReportButton';
import { SubscribeButton } from '@Components/SubscribeButton';
import { Image } from '@Components/ui/image';
import { useToastActions } from '@Hooks/toast';
import { queryClient } from '@Libs/queryclient';
import { requestGetVoteCandidates, requestSendVoteResult } from '@Services/vote';
import { SwipeDirection, TLocalVoteData, useVotingStore } from '@Stores/vote';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TVoteCandidateCard } from '@Types/model';
import { ServiceErrorResponse } from '@Types/serviceError';
import { cn, generateAnonName, loadLocalData, prefetchImages, removeLocalData, saveLocalData } from '@Utils/index';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { AnimatePresence, motion, MotionValue, useMotionValue, useTransform, Variants } from 'framer-motion';
import { useEffect, useLayoutEffect, useState, useTransition } from 'react';
import { VscLoading } from 'react-icons/vsc';
import { RandomAvatar } from './RandomAvatar';

const voteFadeInImage = '/assets/fade_in_btn.png';
const voteFadeOutImage = '/assets/fade_out_btn.png';

const viewVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const baseAnimateProps = { initial: 'initial', animate: 'animate', exit: 'exit' };

const cardVariants: Variants = {
  current: { opacity: 1, y: 0, scale: 1, zIndex: 0 },
  upcoming: { opacity: 0.5, y: -64, scale: 0.9, zIndex: -1 },
  remainings: { opacity: 0, y: 0, scale: 0.9, zIndex: -1 },
  exit: (direction: SwipeDirection) => ({ x: direction === 'left' ? '-50%' : '50%', y: 40, rotate: direction === 'left' ? -20 : 20, opacity: 0 }),
};

const letterVariants: Variants = {
  initial: (direction: SwipeDirection) => ({ y: direction === 'left' ? '-100%' : '100%' }),
  animate: { y: 0 },
  exit: (direction: SwipeDirection) => ({ y: direction === 'left' ? '100%' : '-100%' }),
};

const offsetBoundary = 150;

const inputX = [offsetBoundary * -1, 0, offsetBoundary];
const tightInputX = [(offsetBoundary - 100) * -1, 0, offsetBoundary - 100];
const outputX = [-400, 0, 400];
const outputRotate = [-45, 0, 45];
const outputOpacity = [1, 0, 1];

type VotingViewType = 'loading' | 'voting' | 'submitting';

/**
 * VotingView에 들어올 수 있는 엔트리 포인트
 * 1. 서비스 최초로 접속 (voteData 없음)
 * 2. 오늘 투표를 안 했는데, 투표를 하다가 재접속한 경우 (voteData 있음)
 * 3. 오늘 투표를 했고 재투표하는 경우 (voteData 없음)
 *
 * 2번의 케이스를 처리하기 위해 voteData가 있으면 해당 데이터를 넘겨주고,
 * 없으면 새로 패칭해야 함.
 */

export function VotingView({ onVoteFlowDone }: { onVoteFlowDone: () => void }) {
  const { showToast } = useToastActions();

  const cycleId = useVotingStore((state) => state.cycleId);
  const isVotingInProgress = useVotingStore((state) => state.isVotingInProgress);

  const setViewCards = useVotingStore((state) => state.setViewCards);
  const setVoteResults = useVotingStore((state) => state.setVoteResults);
  const setVotingProgress = useVotingStore((state) => state.setVotingProgress);
  const setHasVotedToday = useVotingStore((state) => state.setHasVotedToday);
  const setIsVotingInProgress = useVotingStore((state) => state.setIsVotingInProgress);

  const localVoteData = loadLocalData('FADE_VOTE_DATA');
  const hasLocalVoteData = localVoteData !== null;
  const parsedVoteData = hasLocalVoteData ? (JSON.parse(localVoteData) as TLocalVoteData) : null;

  const { data: response, isSuccess } = useQuery({
    queryKey: ['vote', 'candidates', cycleId],
    queryFn: () => requestGetVoteCandidates(),
    enabled: !isVotingInProgress && !hasLocalVoteData, // 새로 패칭해야 하는 경우는 투표를 진행할 때가 아니고, 저장된 투표 정보가 없을 때
  });

  /** 로컬 투표 정보 or Fetching 데이터가 설정되면 true로 변경 */
  const [isDataAwaited, setIsDataAwaited] = useState(false);

  useEffect(() => {
    if (!isSuccess || isVotingInProgress) {
      return;
    }

    const { voteCandidates } = response;
    const hasNoVoteCandidate = voteCandidates.length === 0;

    /** 투표할 사진이 없을 때 예외 처리 */
    if (hasNoVoteCandidate) {
      showToast({ type: 'basic', title: '오늘 투표할 페이더들의 사진이 없습니다.' });

      /** 투표 진행 정보 제거 */
      removeLocalData('FADE_VOTE_DATA');

      /** 오늘 투표 완료 설정 */
      setHasVotedToday(true);
      saveLocalData('FADE_LAST_VOTED_AT', format(new Date(), 'yyyy-MM-dd'));

      /** 투표 Flow 종료 */
      setIsVotingInProgress(false);
      onVoteFlowDone();

      return;
    }

    /** viewCards 설정 */
    const voteCandidateCards: TVoteCandidateCard[] = voteCandidates.map((voteCandidate) => ({
      ...voteCandidate,
      anonName: generateAnonName(),
    }));

    setViewCards(voteCandidateCards);

    /** 비동기로 투표 후보지 사진 Prefetch */
    const candidateImages = voteCandidates.map(({ imageURL }) => `${imageURL}?w=720&q=10`);

    prefetchImages(candidateImages)
      .catch(() => showToast({ type: 'error', title: '사진을 불러오지 못했어요.' }))
      .finally(() => {
        setIsVotingInProgress(true);
        setIsDataAwaited(true);
      });

    /** 투표 진행 정보 저장 */
    const newLocalVoteData: TLocalVoteData = {
      viewCards: voteCandidateCards,
      voteResults: [],
    };

    saveLocalData('FADE_VOTE_DATA', JSON.stringify(newLocalVoteData));
  }, [isSuccess]);

  useEffect(() => {
    if (!parsedVoteData) {
      return;
    }

    const { viewCards, voteResults } = parsedVoteData;

    setViewCards(viewCards);
    setVoteResults(voteResults);

    setIsVotingInProgress(true);
    setVotingProgress(voteResults.length + 1);

    setIsDataAwaited(true);
  }, [parsedVoteData]);

  return (
    <AnimatePresence mode="wait">
      {!isDataAwaited && (
        <motion.div key="loading-view" variants={viewVariants} {...baseAnimateProps} className="h-full w-full">
          <LoadingVoteCandidatesView />
        </motion.div>
      )}

      {isDataAwaited && (
        <motion.div key="awaited-view" variants={viewVariants} {...baseAnimateProps} className="h-full w-full">
          <VoteFlowHandler onVoteFlowDone={onVoteFlowDone} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface TVoteFlowHandler {
  onVoteFlowDone: () => void;
}

type VoteFlowHandlerProps = TVoteFlowHandler;

function VoteFlowHandler({ onVoteFlowDone }: VoteFlowHandlerProps) {
  const setHasVotedToday = useVotingStore((state) => state.setHasVotedToday);
  const setIsVotingInProgress = useVotingStore((state) => state.setIsVotingInProgress);

  const [viewId, setViewId] = useState<VotingViewType>('voting');

  const isVotingView = viewId === 'voting';
  const isSubmittingView = viewId === 'submitting';

  /** 사용자의 투표 동작이 끝남 */
  const handleVoteFinish = () => {
    setIsVotingInProgress(false);
    setViewId('submitting');
  };

  /** 서버에 투표 정보 제출 완료 */
  const handleSubmitDone = (isSuccess: boolean) => {
    /** 제출 실패 시 로컬 투표 정보은 남겨둠 */
    if (!isSuccess) {
      return onVoteFlowDone();
    }

    removeLocalData('FADE_VOTE_DATA');
    saveLocalData('FADE_LAST_VOTED_AT', format(new Date(), 'yyyy-MM-dd'));

    queryClient.invalidateQueries({ queryKey: ['user', 'me', 'voteHistory'], refetchType: 'all' });

    setHasVotedToday(true);
    setIsVotingInProgress(false);
    setViewId('loading'); // 필요 없는 구분인데 fake progress의 동작을 위해!
    onVoteFlowDone();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {isVotingView && (
          <motion.div key="awaited-data-view" variants={viewVariants} {...baseAnimateProps} className="h-full w-full">
            <AwaitedVotingView onVoteFinish={handleVoteFinish} />
          </motion.div>
        )}

        {isSubmittingView && (
          <motion.div key="submitting-view" variants={viewVariants} {...baseAnimateProps} className="h-full w-full">
            <SubmittingView onSubmitDone={handleSubmitDone} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TSubmittingView {
  onSubmitDone: (isSucess: boolean) => void;
}

type SubmittingViewProps = TSubmittingView;

function SubmittingView({ onSubmitDone }: SubmittingViewProps) {
  const { showToast } = useToastActions();

  const startTransition = useTransition()[1];
  const clearVoteResults = useVotingStore((state) => state.clearVoteResults);
  const voteResults = useVotingStore((state) => state.voteResults);

  const { mutate: sendVoteResult } = useMutation({
    mutationKey: ['sendVoteResult'],
    mutationFn: requestSendVoteResult,
  });

  useEffect(() => {
    /** Initial Animation 보장을 위한 Transition */
    startTransition(() => {
      sendVoteResult(voteResults, {
        onSuccess() {
          onSubmitDone(true);
          clearVoteResults();
        },
        onError(error) {
          onSubmitDone(false);

          /** TODO: showErrorToast 전역으로 빼기 */
          if (isAxiosError<ServiceErrorResponse>(error) && error.response) {
            const { errorCode } = error.response!.data.result;

            /** 비정상적인 서비스 이용으로 인한 오류는 자세히 알려주지 않는 것이 보안적으로 좋긴 해서... */
            if (errorCode === 'DUPLICATE_VOTE_ERROR') {
              showToast({ type: 'error', title: '투표 결과 전송 실패', description: '알 수 없는 오류로 전송에 실패했어요.' });
              return;
            }
          }

          showToast({ type: 'error', title: `알 수 없는 오류(${error.name})`, description: error.message });
        },
      });
    });
  }, []);

  const [fakeProgress, setFakeProgress] = useState(10);

  useEffect(() => {
    const randomInterval = 500 + Math.floor(Math.random() * 500);

    const timerId = setInterval(() => {
      const randomProgressValue = Math.floor(Math.random() * 25);
      setFakeProgress((prevValue) => prevValue + randomProgressValue);
    }, randomInterval);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute left-0 top-0 h-1 w-full">
        <motion.div
          key="fake-progress-2"
          className="h-full bg-purple-500 shadow-bento"
          initial={{ width: 0 }}
          animate={{ width: `${fakeProgress > 90 ? 90 : fakeProgress}%` }}
          exit={{ width: `100%` }}
        />
      </div>

      <div className="space-y-4">
        <VscLoading className="mx-auto animate-spin fill-purple-500 text-[4rem]" />
        <p className="text-center text-lg">투표 결과를 안전하게 전송 중이에요</p>
      </div>
    </div>
  );
}

function LoadingVoteCandidatesView() {
  const [fakeProgress, setFakeProgress] = useState(10);

  useEffect(() => {
    const randomInterval = 500 + Math.floor(Math.random() * 500);

    const timerId = setInterval(() => {
      const randomProgressValue = Math.floor(Math.random() * 25);
      setFakeProgress((prevValue) => prevValue + randomProgressValue);
    }, randomInterval);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute left-0 top-0 h-1 w-full">
        <motion.div
          key="fake-progress"
          className="h-full bg-purple-500 shadow-bento"
          initial={{ width: 0 }}
          animate={{ width: `${fakeProgress > 90 ? 90 : fakeProgress}%` }}
          exit={{ width: `100%` }}
        />
      </div>

      <div className="space-y-4">
        <VscLoading className="mx-auto animate-spin fill-purple-500 text-[4rem]" />
        <p className="text-center text-lg">투표 목록을 불러오는 중입니다</p>
      </div>
    </div>
  );
}

function AwaitedVotingView({ onVoteFinish }: { onVoteFinish: () => void }) {
  const clearVotingProgress = useVotingStore((state) => state.clearVotingProgress);
  const viewCards = useVotingStore((state) => state.viewCards);

  useLayoutEffect(() => {
    if (viewCards.length === 0) {
      clearVotingProgress();
      onVoteFinish();
      return;
    }

    const voteData = JSON.parse(loadLocalData('FADE_VOTE_DATA')!) as TLocalVoteData;
    saveLocalData('FADE_VOTE_DATA', JSON.stringify({ ...voteData, viewCards }));
  }, [viewCards]);

  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <VoteCandidateCards />
      <VotingTools />
    </div>
  );
}

function VoteCandidateCards() {
  const viewCards = useVotingStore((state) => state.viewCards);
  const swipeDirection = useVotingStore((state) => state.swipeDirection);

  return (
    <div className="relative flex-1">
      <AnimatePresence custom={swipeDirection}>
        {viewCards.map((card, i) => {
          const isLastCard = i === viewCards.length - 1;
          const isUpcoming = i === viewCards.length - 2;

          return (
            <motion.div
              key={`card-${i}`}
              id={`card-${i}`}
              className={`absolute flex h-full w-full`}
              variants={cardVariants}
              custom={swipeDirection}
              initial="remainings"
              animate={isLastCard ? 'current' : isUpcoming ? 'upcoming' : 'remainings'}
              exit="exit">
              <VoteCandidateCard {...card} isCurrentCard={isLastCard} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

type VoteCandidateCardProps = { isCurrentCard: boolean } & TVoteCandidateCard;

function VoteCandidateCard({ feedId, imageURL, isCurrentCard }: VoteCandidateCardProps) {
  const handleSelect = useVotingStore((state) => state.handleSelect);

  const x = useMotionValue(0);

  const computedX = useTransform(x, inputX, outputX);
  const computedRotate = useTransform(x, inputX, outputRotate);
  const computedOpacity = useTransform(x, tightInputX, outputOpacity);

  const [isReporting, setIsReporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffBoundary, setDragOffBoundary] = useState<SwipeDirection | null>(null);

  const isLeftBoundary = dragOffBoundary === 'left';
  const isRightBoundary = dragOffBoundary === 'right';

  const handleReportEnd = () => {
    setIsReporting(false);
    setIsDragging(false);

    handleSelect('left');
  };

  return (
    <motion.div
      style={{ x: computedX, rotate: computedRotate, backgroundImage: `url('${imageURL}')` }}
      className="relative flex-1 rounded-lg bg-gray-200 bg-contain bg-center bg-no-repeat shadow-bento">
      {isCurrentCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn('absolute right-4 top-4 z-[2]', {
            ['z-1']: isDragging || isReporting,
          })}>
          <ReportButton feedId={feedId} onReportEnd={handleReportEnd} />
        </motion.div>
      )}

      <motion.div style={{ opacity: computedOpacity }} className="absolute inset-0 grid place-items-center rounded-lg bg-purple-500">
        <AnimatePresence>
          {isLeftBoundary && <FadeOutCover />}
          {isRightBoundary && <FadeInCover />}
        </AnimatePresence>
      </motion.div>

      <DragController
        x={x}
        onDragOffBoundary={(boundary) => setDragOffBoundary(boundary)}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />
    </motion.div>
  );
}

function FadeOutCover() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[3.2725rem] w-[21.875rem]">
      <Image src="/assets/fade_out_cover.png" local />
    </motion.div>
  );
}

function FadeInCover() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[3.2725rem] w-[16.7719rem]">
      <Image src="/assets/fade_in_cover.png" local />
    </motion.div>
  );
}

type DragControllerProps = {
  x: MotionValue;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOffBoundary: (boundary: SwipeDirection | null) => void;
};

function DragController({ x, onDragStart, onDragEnd, onDragOffBoundary }: DragControllerProps) {
  const handleSelect = useVotingStore((state) => state.handleSelect);

  return (
    <motion.div
      style={{ x }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      drag
      dragSnapToOrigin
      dragElastic={0.06}
      dragConstraints={{ left: 0, right: 0 }}
      dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
      onDragStart={onDragStart}
      onDrag={(_, { offset: { x } }) => {
        const isLeftDirection = x < 0; // && x < offsetBoundary * -1;
        const isRightDirection = x > 0; // && x > offsetBoundary;
        const hasNoDirection = !isLeftDirection && !isRightDirection;

        isLeftDirection && onDragOffBoundary('left');
        isRightDirection && onDragOffBoundary('right');
        hasNoDirection && onDragOffBoundary(null);
      }}
      onDragEnd={(_, { offset: { x } }) => {
        onDragOffBoundary(null);
        onDragEnd();

        const isOffBoundary = x > offsetBoundary || x < -offsetBoundary;
        const direction = x > 0 ? 'right' : 'left';

        isOffBoundary && handleSelect(direction);
      }}
    />
  );
}

function UserDetailCard() {
  const anonName = useVotingStore(({ viewCards }) => viewCards.at(-1)?.anonName || '');
  const isSubscribed = useVotingStore(({ viewCards }) => viewCards.at(-1)?.isSubscribed || false);
  const memberId = useVotingStore(({ viewCards }) => viewCards.at(-1)?.memberId || -1);

  const handleSubscribeToggle = (value: boolean) => {
    const voteData = JSON.parse(loadLocalData('FADE_VOTE_DATA')!) as TLocalVoteData;
    const matchedItem = voteData.viewCards.at(-1)!; // 구독은 마지막 아이템에만 할 수 있음

    saveLocalData(
      'FADE_VOTE_DATA',
      JSON.stringify({ ...voteData, viewCards: [...voteData.viewCards.slice(0, -1), { ...matchedItem, isSubscribed: value }] } as TLocalVoteData)
    );
  };

  return (
    <div className="flex flex-row items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 shadow-bento">
      <RandomAvatar />
      <AnimatedUsername name={anonName} />
      <SubscribeButton initialSubscribedStatus={isSubscribed} userId={memberId} onToggle={handleSubscribeToggle} />
    </div>
  );
}

function AnimatedUsername({ name }: { name: string }) {
  const swipeDirection = useVotingStore((state) => state.swipeDirection);

  return (
    <div className="relative flex h-full flex-1 items-center">
      <span className="pr-1">익명의</span>
      <div className="relative inline-block flex-1">
        <AnimatePresence custom={swipeDirection} initial={false}>
          <motion.div
            {...baseAnimateProps}
            key={`${name}-${Math.random() * 1024}`}
            className="absolute top-1/2 flex-1 -translate-y-1/2 overflow-hidden"
            transition={{ staggerChildren: 0.007 }}>
            {name.split('').map((letter, index) => {
              return (
                <motion.span
                  key={`${name}-${letter}-${index}`}
                  id={`${name}-${letter}-${index}`}
                  variants={letterVariants}
                  custom={swipeDirection}
                  className={cn('inline-block whitespace-normal', { ['pl-1']: letter === ' ' })}>
                  {letter}
                </motion.span>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function VotingTools() {
  const handleSelect = useVotingStore((state) => state.handleSelect);
  const feedId = useVotingStore(({ viewCards }) => viewCards.at(-1)?.feedId || -1);
  const isBookmarked = useVotingStore(({ viewCards }) => viewCards.at(-1)?.isBookmarked || false);

  const handleBookmarkToggle = (value: boolean) => {
    const voteData = JSON.parse(loadLocalData('FADE_VOTE_DATA')!) as TLocalVoteData;
    const matchedItem = voteData.viewCards.at(-1)!; // 구독은 마지막 아이템에만 할 수 있음

    saveLocalData(
      'FADE_VOTE_DATA',
      JSON.stringify({ ...voteData, viewCards: [...voteData.viewCards.slice(0, -1), { ...matchedItem, isBookmarked: value }] } as TLocalVoteData)
    );
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <UserDetailCard />

      <div className="flex flex-row gap-3">
        <VoteButton type="fadeOut" onClick={() => handleSelect('left')} />
        <VoteButton type="fadeIn" onClick={() => handleSelect('right')} />
        <BookmarkButton feedId={feedId} defaultBookmarkStatus={isBookmarked} shadow onToggle={handleBookmarkToggle} />
      </div>
    </div>
  );
}

type VoteButtonProps = { type: 'fadeIn' | 'fadeOut'; onClick: () => void };

function VoteButton({ type, onClick }: VoteButtonProps) {
  const isFadeIn = type === 'fadeIn';
  const isFadeOut = type === 'fadeOut';

  return (
    <button
      className={cn('group flex-1 rounded-lg bg-white px-5 py-3 shadow-bento transition-colors', {
        ['touchdevice:active:bg-gray-200 pointerdevice:hover:bg-gray-200 pointerdevice:active:bg-gray-300']: isFadeOut,
        ['touchdevice:active:bg-purple-200 pointerdevice:hover:bg-purple-200 pointerdevice:active:bg-purple-300']: isFadeIn,
      })}
      onClick={onClick}>
      <div
        style={{ backgroundImage: `url('${isFadeIn ? voteFadeInImage : voteFadeOutImage}')` }}
        className={cn('mx-auto h-5 bg-contain bg-center bg-no-repeat transition-transform', {
          ['touchdevice:group-active:translate-y-[.125rem] pointerdevice:group-hover:translate-y-[.125rem]']: isFadeOut,
          ['touchdevice:group-active:-translate-y-[.125rem] pointerdevice:group-hover:-translate-y-[.125rem]']: isFadeIn,
        })}
      />
    </button>
  );
}
