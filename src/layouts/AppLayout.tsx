import { Header } from '@Components/Header';
import { NavBar } from '@Components/NavBar';
import { ToastProvider } from '@Components/ToastProvider';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FlexibleLayout } from './FlexibleLayout';
import { useVotingStore } from '@Stores/vote';
import LockUI from '@Components/LockUI';

export default function AppLayout() {
  const location = useLocation();
  
  const hasVotedToday = useVotingStore((state) => state.hasVotedToday);
  const isVoteFAPPath = location.pathname === '/vote-fap';
  const shouldShowLockUI = !hasVotedToday && !isVoteFAPPath

  return (
    <FlexibleLayout.Root className="w-full flex-1">
      <FlexibleLayout.Header>
        <Header />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        {shouldShowLockUI && <LockUI />}
        {!shouldShowLockUI && (
          <Suspense fallback={<>페이지 로딩 중!</>}>
            <Outlet />
          </Suspense>
        )}

        <ToastProvider />
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <NavBar hasVotedToday={hasVotedToday} isVoteFAPPath={isVoteFAPPath} />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}
