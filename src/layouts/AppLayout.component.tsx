import { Header } from '@Components/Header';
import { NavBar } from '@Components/NavBar';
import { useHeaderStore } from '@Stores/header';
import { cn } from '@Utils/index';
import { Outlet } from 'react-router-dom';
import { FlexibleLayout } from './FlexibleLayout';

export default function AppLayoutComponent() {
  const isSubSlotVisible = useHeaderStore((state) => state.isSubSlotVisible);

  return (
    <FlexibleLayout.Root className="w-full flex-1">
      <FlexibleLayout.Header>
        <Header />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className={cn({ ['-z-10']: isSubSlotVisible })}>
        <Outlet />
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <NavBar />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}
