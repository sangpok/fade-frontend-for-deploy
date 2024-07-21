import { useModalActions } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { SwipeDirection, useVotingStore } from '@Stores/vote';
import { cn, generateAnonName } from '@Utils/index';
import { AnimatePresence, motion, MotionValue, useMotionValue, useTransform, Variants } from 'framer-motion';
import { useLayoutEffect, useState } from 'react';
import { MdBookmark, MdReport } from 'react-icons/md';
import { ReportBottomSheet, ReportResult } from './ReportBottomSheet';

import swipeFadeInImage from '@Assets/swipe_fade_in.png';
import swipeFadeOutImage from '@Assets/swipe_fade_out.png';
import voteFadeInImage from '@Assets/vote_fade_in.png';
import voteFadeOutImage from '@Assets/vote_fade_out.png';

import profileDefaultImage1 from '@Assets/profile_default_1.jpg';
import profileDefaultImage2 from '@Assets/profile_default_2.jpg';
import profileDefaultImage3 from '@Assets/profile_default_3.jpg';
import profileDefaultImage4 from '@Assets/profile_default_4.jpg';

const defaultProfileImages = [profileDefaultImage1, profileDefaultImage2, profileDefaultImage3, profileDefaultImage4];

const cardVariants: Variants = {
  current: { opacity: 1, y: 0, scale: 1, zIndex: 0 },
  upcoming: { opacity: 0.5, y: -64, scale: 0.9, zIndex: -1 },
  remainings: { opacity: 0, y: 0, scale: 0.9 },
  exit: (direction: SwipeDirection) => ({ x: direction === 'left' ? -300 : 300, y: 40, rotate: direction === 'left' ? -20 : 20, opacity: 0 }),
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

export function VotingView({ onFinishVote }: { onFinishVote: () => void }) {
  const clearVotingProgress = useVotingStore((state) => state.clearVotingProgress);
  const setHasVotedToday = useVotingStore((state) => state.setHasVotedToday);
  const hasVotedToday = useVotingStore((state) => state.hasVotedToday);

  const viewCards = useVotingStore((state) => state.viewCards);

  useLayoutEffect(() => {
    if (viewCards.length === 0) {
      !hasVotedToday && setHasVotedToday(true);

      clearVotingProgress();
      onFinishVote();
    }
  }, [viewCards]);

  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <FahsionCards />
      <VotingTools />
    </div>
  );
}

function FahsionCards() {
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
              <FashionCard isCurrentCard={isLastCard} imageURL={card.imageURL} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

type FashionCardProps = { imageURL: string; isCurrentCard: boolean };

function FashionCard({ imageURL, isCurrentCard }: FashionCardProps) {
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

  const { showToast } = useToastActions();

  const handleReportEnd = (reportResult?: ReportResult) => {
    setIsReporting(false);

    if (reportResult === undefined) {
      return;
    }

    showToast({ type: 'basic', title: '신고되었습니다.' });
    handleSelect('left');
  };

  return (
    <motion.div
      style={{
        x: computedX,
        rotate: computedRotate,
        backgroundImage: `url('${imageURL}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      className="relative flex-1 rounded-lg bg-gray-200 shadow-bento">
      {isCurrentCard && <ReportButton shouldBelowZIndex={isDragging || isReporting} onReportStart={() => setIsDragging(true)} onReportEnd={handleReportEnd} />}

      <motion.div style={{ opacity: computedOpacity }} className="absolute inset-0 grid place-items-center rounded-lg bg-purple-500">
        {isLeftBoundary && <FadeOutCover />}
        {isRightBoundary && <FadeInCover />}
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

type ReportButtonProps = { shouldBelowZIndex: boolean; onReportStart: () => void; onReportEnd: (result: ReportResult | undefined) => void };

function ReportButton({ shouldBelowZIndex, onReportStart, onReportEnd }: ReportButtonProps) {
  const { showModal } = useModalActions();

  const handleReportClick = async () => {
    onReportStart();
    const reportResult = await startReportFlow();
    onReportEnd(reportResult);
  };

  const startReportFlow = async () => {
    // TODO: Report에 사진 ID? 유저 ID? 넘겨주긴 해야 함
    return await showModal<ReportResult>({ type: 'bottomSheet', Component: ReportBottomSheet });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('group absolute right-4 top-4 z-[2] cursor-pointer rounded-lg bg-white px-2 py-1', {
        ['z-1']: shouldBelowZIndex,
      })}
      onClick={() => handleReportClick()}>
      <div className="flex flex-row items-center gap-1 transition-transform group-active:scale-95">
        <MdReport className="size-[1.125rem]" />
        <span>신고하기</span>
      </div>
    </motion.button>
  );
}

function FadeOutCover() {
  return <div style={{ backgroundImage: `url('${swipeFadeOutImage}')`, backgroundSize: 'cover' }} className="h-[3.2725rem] w-[21.875rem]" />;
}

function FadeInCover() {
  return <div style={{ backgroundImage: `url('${swipeFadeInImage}')`, backgroundSize: 'cover' }} className="h-[3.2725rem] w-[16.7719rem]" />;
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
        const isLeftDirection = x < 0 && x < offsetBoundary * -1;
        const isRightDirection = x > 0 && x > offsetBoundary;
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

function SubscribeButton() {
  const randomProfileImage = defaultProfileImages.at(Math.floor(Math.random() * 4));
  const randomAnonName = generateAnonName();

  return (
    <div className="flex flex-row items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 shadow-bento">
      <div style={{ backgroundImage: `url('${randomProfileImage}')` }} className="size-8 rounded-lg" />
      <AnimatedUsername name={randomAnonName} />
      <button className="rounded-lg border border-gray-200 px-4 py-1">구독</button>
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
            key={name}
            className="absolute top-1/2 flex-1 -translate-y-1/2 overflow-hidden"
            initial="initial"
            animate="animate"
            exit="exit"
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

  return (
    <div className="flex w-full flex-col gap-3">
      <SubscribeButton />

      <div className="flex flex-row gap-3">
        <VoteButton type="fadeOut" onClick={() => handleSelect('left')} />
        <VoteButton type="fadeIn" onClick={() => handleSelect('right')} />
        <BookmarkButton />
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
        ['pointerdevice:hover:bg-gray-200 pointerdevice:active:bg-gray-300']: isFadeOut,
        ['pointerdevice:hover:bg-purple-200 pointerdevice:active:bg-purple-300']: isFadeIn,
      })}
      onClick={onClick}>
      <div
        style={{
          backgroundImage: `url('${isFadeIn ? voteFadeInImage : voteFadeOutImage}')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        className={cn('mx-auto h-5 transition-transform', {
          ['pointerdevice:group-hover:translate-y-[.125rem]']: isFadeOut,
          ['pointerdevice:group-hover:-translate-y-[.125rem]']: isFadeIn,
        })}
      />
    </button>
  );
}

function BookmarkButton() {
  return (
    <button className="rounded-lg bg-white p-3 shadow-bento">
      <MdBookmark className="size-6 text-gray-600" />
    </button>
  );
}
