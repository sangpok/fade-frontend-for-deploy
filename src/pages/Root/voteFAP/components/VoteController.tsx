import { FashionCard, useVotingStore } from '@Stores/vote';
import { generateRandomId } from '@Utils/index';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useState } from 'react';
import { ReadyToVoteView } from './ReadyToVoteView';
import { RestartVotingView } from './RestartVotingView';
import { VotingView } from './VotingView';

import testFashionImage1 from '@Assets/test_fashion_image.jpg';
import testFashionImage10 from '@Assets/test_fashion_image_10.jpg';
import testFashionImage2 from '@Assets/test_fashion_image_2.jpg';
import testFashionImage3 from '@Assets/test_fashion_image_3.jpg';
import testFashionImage4 from '@Assets/test_fashion_image_4.jpg';
import testFashionImage5 from '@Assets/test_fashion_image_5.webp';
import testFashionImage6 from '@Assets/test_fashion_image_6.jpg';
import testFashionImage7 from '@Assets/test_fashion_image_7.jpg';
import testFashionImage8 from '@Assets/test_fashion_image_8.jpg';
import testFashionImage9 from '@Assets/test_fashion_image_9.jpg';

const testFahsionImages = [
  testFashionImage1,
  testFashionImage2,
  testFashionImage3,
  testFashionImage4,
  testFashionImage5,
  testFashionImage6,
  testFashionImage7,
  testFashionImage8,
  testFashionImage9,
  testFashionImage10,
];

const viewVariants: Variants = {
  initial: { y: -12, scale: 0.95, opacity: 0, transformOrigin: 'top center' },
  animate: { y: 0, scale: 1, opacity: 1 },
  exit: { y: 0, scale: 0.95, opacity: 0, transformOrigin: 'bottom center' },
};

const baseAnimateProps = { initial: 'initial', animate: 'animate', exit: 'exit' };

const testCards: FashionCard[] = testFahsionImages.map((image) => ({
  userId: generateRandomId(),
  imageURL: image,
}));

const enum VoteViewType {
  BEFORE_VOTING = 'before_voting',
  VOTING = 'voting',
  AFTER_VOTING = 'after_voting',
}

export function VoteController() {
  const setViewCards = useVotingStore((state) => state.setViewCards);
  const isVotingInProgress = useVotingStore((state) => state.isVotingInProgress);

  const [viewId, setViewId] = useState<VoteViewType>(isVotingInProgress ? VoteViewType.VOTING : VoteViewType.BEFORE_VOTING);
  const setIsVotingInProgress = useVotingStore((state) => state.setIsVotingInProgress);

  const isBeforeVoting = viewId === VoteViewType.BEFORE_VOTING;
  const isVoting = viewId === VoteViewType.VOTING;
  const isAfterVoting = viewId === VoteViewType.AFTER_VOTING;

  return (
    <>
      <div className="h-full">
        <BackgroundEllipse />

        <AnimatePresence mode="wait">
          {isBeforeVoting && (
            <motion.div {...baseAnimateProps} key="view-1" variants={viewVariants} className="h-full">
              <ReadyToVoteView
                onStartClick={() => {
                  setViewCards(testCards);
                  setViewId(VoteViewType.VOTING);
                  setIsVotingInProgress(true);
                }}
              />
            </motion.div>
          )}

          {isVoting && (
            <motion.div {...baseAnimateProps} key="view-2" variants={viewVariants} className="h-full">
              <VotingView
                onFinishVote={() => {
                  setViewId(VoteViewType.AFTER_VOTING);
                  setIsVotingInProgress(false);
                }}
              />
            </motion.div>
          )}

          {isAfterVoting && (
            <motion.div {...baseAnimateProps} key="view-3" variants={viewVariants} className="h-full">
              <RestartVotingView
                onRestartVote={() => {
                  setViewCards(testCards);
                  setViewId(VoteViewType.VOTING);
                  setIsVotingInProgress(true);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function BackgroundEllipse() {
  return <div className="absolute bottom-0 left-1/2 -z-10 h-[25rem] w-[170%] -translate-x-1/2 rounded-[100%/100%] bg-purple-50" />;
}
