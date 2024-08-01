import { AsyncErrorBoundary } from '@Components/AsyncErrorBoundary';
import { MockingButton } from '@Components/MockingButton';
import { ModalProvider } from '@Components/ModalProvider';
import { cn } from '@Utils/index';
import { Outlet, useLocation } from 'react-router-dom';

import onboardingBackground from '@Assets/onboarding_background.jpg';

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

      <div className="absolute left-1/2 top-4 z-50 -translate-x-1/2 opacity-30 transition-opacity focus-within:opacity-100 touchdevice:active:opacity-100 pointerdevice:hover:opacity-100 pwa:pt-[var(--sat)]">
        <MockingButton />
      </div>
    </div>
  );
}
