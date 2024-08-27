import { ShowNotificationButton } from '@Components/ShowNotificationButton';
import { Button } from '@Components/ui/button';
import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { useAuthStore } from '@Stores/auth';
import { useVotingStore } from '@Stores/vote';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutEffect } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { VoteController } from './components/VoteController';
import { VotePolicyBottomSheet } from './components/VotePolicyBottomSheet';

export default function Page() {
  useHeader({
    title: 'FA:P 투표',
    leftSlot: () => <ShowVotePolicyButton />,
    rightSlot: () => <ShowNotificationButton />,
  });

  useLayoutEffect(() => {
    /** Prefetch the tab components */
    Promise.all([
      import('@Pages/Root/archive/page'), // 아카이브 탭
      import('@Pages/Root/archive/page.skeleton'), // 아카이브 탭
      import('@Pages/Root/subscribe/page'), // 구독 탭
      import('@Pages/Root/subscribe/page.skeleton'), // 구독 탭
      import('@Pages/Root/subscribe/list/page'), // 구독 목록 탭
      import('@Pages/Root/subscribe/list/page.skeleton'), // 구독 목록 탭
      import('@Pages/Root/mypage/page'), // 마이페이지 탭
      import('@Pages/Root/mypage/page.skeleton'), // 마이페이지 탭
      import('@Pages/Root/mypage/feed/page'), // 마이페이지/피드
      import('@Pages/Root/mypage/feed/page.skeleton'), // 마이페이지/피드
      import('@Pages/Root/mypage/voteHistory/page'), // 마이페이지/투표내역
      import('@Pages/Root/mypage/voteHistory/page.skeleton'), // 마이페이지/투표내역
      import('@Pages/Root/mypage/bookmark/page'), // 마이페이지/북마크
      import('@Pages/Root/mypage/bookmark/page.skeleton'), // 마이페이지/북마크
      import('@Pages/Root/user/page'), // 유저 피드
      import('@Pages/Root/user/page.skeleton'), // 유저 피드
    ]);
  }, []);

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
    <motion.div
      initial={{ opacity: 0, scale: 0.9, transformOrigin: 'top' }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-row rounded-lg border border-gray-200 bg-white p-3 shadow-bento">
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
    </motion.div>
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
