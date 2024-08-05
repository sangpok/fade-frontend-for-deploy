import { Header } from '@Components/Header';
import LockUI from '@Components/LockUI';
import { NavBar } from '@Components/NavBar';
import { useAuthActions, useIsAuthenticated } from '@Hooks/auth';
import { useAuthStore } from '@Stores/auth';
import { useVotingStore } from '@Stores/vote';
import { differenceInMinutes } from 'date-fns';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FlexibleLayout } from './FlexibleLayout';

export default function AppLayout() {
  const navigate = useNavigate();
  const { doRefreshToken } = useAuthActions();
  const isAuthenticated = useIsAuthenticated();
  const exp = useAuthStore((state) => (state.exp || 0) * 1000);
  const lastExpireMinutes = exp ? differenceInMinutes(exp, new Date()) : 999;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (lastExpireMinutes < 10) {
    doRefreshToken().then((isRefreshed) => !isRefreshed && navigate('/login'));
  }

  return (
    <FlexibleLayout.Root className="w-full flex-1">
      <FlexibleLayout.Header>
        <Header />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <ServiceFeatureLockHandler />
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <NavBar />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}

function ServiceFeatureLockHandler() {
  const location = useLocation();

  const hasVotedToday = useVotingStore((state) => state.hasVotedToday);
  const isCurrentVoteFAPPath = location.pathname === '/vote-fap';
  const shouldShowLockUI = !hasVotedToday && !isCurrentVoteFAPPath;

  return (
    <>
      {shouldShowLockUI && <LockUI />}
      {!shouldShowLockUI && <Outlet />}
    </>
  );
}
