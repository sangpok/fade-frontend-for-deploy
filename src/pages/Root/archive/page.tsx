import { ShowNotificationButton } from '@Components/ShowNotificationButton';
import { Button } from '@Components/ui/button';
import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { cn } from '@Utils/index';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useEffect, useState, useTransition } from 'react';
import { MdSearch } from 'react-icons/md';
import { FAPArchivingView } from './components/FAPArchivingView';
import { SearchAccountView } from './components/SearchAccountView';
import { AllArchivingView } from './components/AllArchivingView';

/** 여기 레이아웃이 전체적으로 이상하네... */

const transitionVariants: Variants = {
  initial: (direction: number) => ({ x: `${-10 * direction}%`, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: `${10 * direction}%`, opacity: 0 }),
};

const baseAnimationProps = { initial: 'initial', animate: 'animate', exit: 'exit' };

export default function Page() {
  useHeader({
    title: 'FA:P 아카이브',
    leftSlot: () => <SearchButton />,
    rightSlot: () => <ShowNotificationButton />,
  });

  // const { showModal } = useModalActions();

  const startTransition = useTransition()[1];

  const [isTransitionInProgress, setIsTransitionInProgress] = useState(false);
  const [direction, setDirection] = useState(1);
  const [currentTabId, setCurrentTabId] = useState(0);

  const isFAPTab = currentTabId === 0;
  const isAllTab = currentTabId === 1;

  useEffect(() => {
    // showModal({
    //   type: 'component',
    //   Component: LastFAPModal,
    //   props: { feed: { id: 0, imageURL: testImage }, user: { id: 0, username: 'fade_test', profileURL: testImage } } as LastFAPModalProps,
    // });
  }, []);

  const switchToTab = (newTabId: number) => {
    const isSwitchToFAP = currentTabId - newTabId > 0;
    const newDirection = isSwitchToFAP ? 1 : -1;

    setIsTransitionInProgress(true);

    startTransition(() => {
      setDirection(newDirection);
      setCurrentTabId(newTabId);
    });
  };

  return (
    <div className="flex h-full flex-col">
      <menu className="flex flex-row bg-white px-5">
        <li className="flex-1">
          <button className="relative h-full w-full py-3" onClick={() => switchToTab(0)} disabled={isTransitionInProgress}>
            <span className={cn('text-h6 font-semibold text-gray-500 transition-colors', { ['text-current']: isFAPTab })}>FA:P 아카이브</span>
            {isFAPTab && <TabIndicator />}
          </button>
        </li>
        <li className="flex-1">
          <button className="relative h-full w-full py-3" onClick={() => switchToTab(1)} disabled={isTransitionInProgress}>
            <span className={cn('text-h6 font-semibold text-gray-500 transition-colors', { ['text-current']: isAllTab })}>패션 전체보기</span>
            {isAllTab && <TabIndicator />}
          </button>
        </li>
      </menu>

      <div className="relative flex h-full">
        <AnimatePresence custom={direction} initial={false} onExitComplete={() => setIsTransitionInProgress(false)}>
          {isFAPTab && (
            <motion.div key="fap-view" className="absolute flex h-full w-full" custom={direction} variants={transitionVariants} {...baseAnimationProps}>
              <FAPArchivingView />
            </motion.div>
          )}
          {isAllTab && (
            <motion.div key="all-view" className="absolute flex h-full w-full" custom={direction} variants={transitionVariants} {...baseAnimationProps}>
              <AllArchivingView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SearchButton() {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: SearchAccountView });
  };

  return (
    <Button variants="ghost" onClick={handleClick}>
      <MdSearch className="size-6" />
    </Button>
  );
}

function TabIndicator() {
  return <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 h-1 w-full bg-purple-500" />;
}
