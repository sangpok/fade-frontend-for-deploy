import { Button } from '@Components/ui/button';
import { useHeaderStore } from '@Stores/header';
import { cn } from '@Utils/index';
import { PropsWithChildren, useLayoutEffect, useState } from 'react';
import { MdCheck, MdChevronRight } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const VoteTitleNameMap: Record<string, string> = {
  '/vote/fap': 'FA:P 투표',
  '/vote/buyornot': 'Buy or Not',
};

const getCurrentTitleByPathname = (pathname: string) => VoteTitleNameMap[pathname] || '';

export function VoteSubPageList() {
  const { pathname } = useLocation();
  const currentTitle = getCurrentTitleByPathname(pathname);
  const setSubSlot = useHeaderStore((state) => state.setSubSlot);
  const isSubSlotVisible = useHeaderStore((state) => state.isSubSlotVisible);
  const setIsSubSlotVisible = useHeaderStore((state) => state.setIsSubSlotVisible);

  const [shouldShowBoNCoachMarks, setShouldShowBoNCoachMarks] = useState(localStorage.getItem('FADE_BON_COACHMARK_VISIBLE') !== 'true');

  useLayoutEffect(() => {
    setSubSlot(() => <SubList />);
  }, []);

  const handleClick = () => {
    setIsSubSlotVisible(!isSubSlotVisible);
    setShouldShowBoNCoachMarks(false);
    localStorage.setItem('FADE_BON_COACHMARK_VISIBLE', 'true');
  };

  return (
    <>
      <Button variants="ghost" interactive="onlyScale" className="p-0 text-lg" onClick={handleClick}>
        {currentTitle}
        <MdChevronRight
          className={cn('rotate-90 transition-transform', {
            ['-rotate-90']: isSubSlotVisible,
          })}
        />
      </Button>

      {shouldShowBoNCoachMarks && (
        <div className="absolute left-1/2 top-full min-w-fit -translate-x-1/2">
          <motion.div initial={{ opacity: 0, y: '24px' }} animate={{ opacity: 1, y: 0 }}>
            <BoNCoachMarks />
          </motion.div>
        </div>
      )}
    </>
  );
}

function BoNCoachMarks() {
  return (
    <div className="relative flex flex-row items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-white shadow-lg">
      <span className="text-[2.75rem]">🤔</span>
      <div>
        <p className="text-center">살지 말지 고민되는 아이템이 있다면?</p>
        <p className="text-center text-h5 font-semibold">Buy or Not 투표를 올려보세요!</p>
      </div>

      <div className="absolute bottom-full left-1/2 size-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-purple-500" />
    </div>
  );
}

function SubList() {
  const { pathname } = useLocation();

  return (
    <ul className="space-y-4 rounded-b-lg bg-white p-5 pb-10">
      {Object.entries(VoteTitleNameMap).map(([path, name]) => (
        <SubListItem key={path} href={path} active={path === pathname}>
          {name}
        </SubListItem>
      ))}
    </ul>
  );
}

interface TSubListItem {
  href: string;
  active?: boolean;
}

type SubListItemProps = PropsWithChildren<TSubListItem>;

function SubListItem({ href, active, children }: SubListItemProps) {
  const setIsSubSlotVisible = useHeaderStore((state) => state.setIsSubSlotVisible);

  return (
    <li>
      <Link
        className={cn('flex flex-row items-center justify-between rounded-lg border p-4', {
          ['border border-purple-200 bg-purple-50']: active,
        })}
        to={href}
        onClick={() => setIsSubSlotVisible(false)}>
        {children}

        {active && <MdCheck className="text-purple-400" />}
      </Link>
    </li>
  );
}
