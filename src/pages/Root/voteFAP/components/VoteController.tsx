import { useVotingStore } from '@Stores/vote';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useState } from 'react';
import { ReadyToVoteView } from './ReadyToVoteView';
import { RestartVotingView } from './RestartVotingView';
import { VotingView } from './VotingView';

const viewVariants: Variants = {
  initial: { y: -12, scale: 0.95, opacity: 0, transformOrigin: 'top center' },
  animate: { y: 0, scale: 1, opacity: 1 },
  exit: { y: 0, scale: 0.95, opacity: 0, transformOrigin: 'bottom center' },
};

const baseAnimateProps = { initial: 'initial', animate: 'animate', exit: 'exit' };

const enum VoteViewType {
  BEFORE_VOTING = 'before_voting',
  VOTING = 'voting',
  AFTER_VOTING = 'after_voting',
}

export function VoteController() {
  const isVotingInProgress = useVotingStore((state) => state.isVotingInProgress);
  const [viewId, setViewId] = useState<VoteViewType>(isVotingInProgress ? VoteViewType.VOTING : VoteViewType.BEFORE_VOTING);

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
              <ReadyToVoteView onStartClick={() => setViewId(VoteViewType.VOTING)} />
            </motion.div>
          )}

          {isVoting && (
            <motion.div {...baseAnimateProps} key="view-2" variants={viewVariants} className="h-full">
              <VotingView onSubmitDone={() => setViewId(VoteViewType.AFTER_VOTING)} />
            </motion.div>
          )}

          {isAfterVoting && (
            <motion.div {...baseAnimateProps} key="view-3" variants={viewVariants} className="h-full">
              <RestartVotingView onRestartVote={() => setViewId(VoteViewType.VOTING)} />
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
