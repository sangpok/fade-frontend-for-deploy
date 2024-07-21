import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { useVotingStore } from '@Stores/vote';
import { useState } from 'react';
import { MdInfoOutline, MdOutlineNotificationsNone } from 'react-icons/md';
import { VoteController } from './components/VoteController';
import { VotePolicyBottomSheet } from './components/VotePolicyBottomSheet';
import { AnimatePresence, motion } from 'framer-motion';

export default function Page() {
  useHeader({
    title: 'FA:P 투표',
    leftSlot: () => <ShowVotePolicyButton />,
    rightSlot: () => <ShowNotificationButton />,
  });

  return (
    <FlexibleLayout.Root className="gap-3">
      <FlexibleLayout.Header>
        <VotingCounter />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="overflow-visible p-0">
        <VoteController />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

function VotingCounter() {
  const { hasVotedToday, votingCountToday, isVotingInProgress, votingProgress } = useVotingStore();

  const shouldVoteToday = !hasVotedToday && votingCountToday === 0;

  return (
    <div className="flex flex-row rounded-lg border border-gray-200 bg-white p-3 shadow-bento">
      {shouldVoteToday && <p className="flex-1">FADE_1234님, 오늘의 투표를 진행해보세요!</p>}
      {!shouldVoteToday && <p className="flex-1">FADE_1234님은 오늘 {votingCountToday}회 투표했어요!</p>}

      <AnimatePresence>
        {isVotingInProgress && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-500">
            {votingProgress > 10 ? 10 : votingProgress}/10
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShowVotePolicyButton() {
  const { showModal } = useModalActions();

  const showVotePolicyModal = async () => {
    return await showModal({ type: 'bottomSheet', Component: VotePolicyBottomSheet });
  };

  return (
    <button className="group cursor-pointer rounded-lg p-2 pointerdevice:hover:bg-gray-100" onClick={showVotePolicyModal}>
      <MdInfoOutline className="size-6 group-active:pointerdevice:scale-95" />
    </button>
  );
}

function ShowNotificationButton() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="relative" onClick={() => setIsOpened(!isOpened)}>
      <MdOutlineNotificationsNone className="size-6" />

      {isOpened && (
        <div className="absolute right-4 top-full flex min-w-max rounded border bg-white p-5">
          <p>흐으음..</p>
        </div>
      )}
    </div>
  );
}
