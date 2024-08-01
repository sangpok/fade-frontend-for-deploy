import { Header } from '@Components/Header';
import { NavBar } from '@Components/NavBar';
import { ToastProvider } from '@Components/ToastProvider';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { FlexibleLayout } from './FlexibleLayout';

export default function AppLayout() {
  return (
    <FlexibleLayout.Root className="w-full flex-1">
      <FlexibleLayout.Header>
        <Header />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <Suspense fallback={<>페이지 로딩 중!</>}>
          <Outlet />
        </Suspense>

        <ToastProvider />
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <NavBar />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}
