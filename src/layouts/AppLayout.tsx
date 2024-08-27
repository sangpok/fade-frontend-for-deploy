import { useAuthActions, useIsAuthenticated } from '@Hooks/auth';
import { useAuthStore } from '@Stores/auth';
import { differenceInMinutes } from 'date-fns';
import { lazy, Suspense } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const AppLayoutComponent = lazy(() => import('./AppLayout.component'));

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
    <Suspense>
      <AppLayoutComponent />
    </Suspense>
  );
}
