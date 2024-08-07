import { ShowNotificationButton } from '@Components/ShowNotificationButton';
import { Button } from '@Components/ui/button';
import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { useAuthStore } from '@Stores/auth';
import { useVotingStore } from '@Stores/vote';
import { AnimatePresence, motion } from 'framer-motion';
import { MdInfoOutline } from 'react-icons/md';
import { VoteController } from './components/VoteController';
import { VotePolicyBottomSheet } from './components/VotePolicyBottomSheet';

export default function Page() {
  useHeader({
    title: 'FA:P 투표',
    leftSlot: () => <ShowVotePolicyButton />,
    rightSlot: () => <ShowNotificationButton />,
  });

  return (
    <FlexibleLayout.Root className="gap-3 p-5">
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
  const username = useAuthStore((state) => state.user.username);
  const { hasVotedToday, votingCountToday, isVotingInProgress, votingProgress } = useVotingStore();

  const shouldVoteToday = !hasVotedToday && votingCountToday === 0;

  return (
    <div className="flex flex-row rounded-lg border border-gray-200 bg-white p-3 shadow-bento">
      {shouldVoteToday && <p className="flex-1">{username}님, 오늘의 투표를 진행해보세요!</p>}
      {!shouldVoteToday && (
        <p className="flex-1">
          {username}님은 오늘 {votingCountToday}회 투표했어요!
        </p>
      )}

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
    <Button variants="ghost" size="icon" onClick={showVotePolicyModal}>
      <MdInfoOutline className="size-6" />
    </Button>
  );
}
