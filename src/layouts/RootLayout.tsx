import { ModalProvider } from '@Components/ModalProvider';
import { ToastProvider } from '@Components/ToastProvider';
import { cn } from '@Utils/index';
import { Outlet, useLocation } from 'react-router-dom';

import onboardingBackground from '@Assets/onboarding_background.jpg';
import { AsyncErrorBoundary } from '@Components/AsyncErrorBoundary';

export default function RootLayout() {
  const { pathname } = useLocation();

  const isLoginPage = pathname === '/login';

  return (
    <div
      id="rootLayout"
      style={{ backgroundImage: isLoginPage ? `url('${onboardingBackground}')` : '' }}
      className={cn('relative mx-auto h-1 min-h-dvh w-full overflow-hidden pt-[var(--sat)] md:max-w-[48rem] md:border-x', {
        ['bg-cover bg-center bg-no-repeat']: isLoginPage,
      })}>
      <AsyncErrorBoundary>
        <Outlet />
      </AsyncErrorBoundary>

      <ModalProvider />
      <ToastProvider />
    </div>
  );
}
