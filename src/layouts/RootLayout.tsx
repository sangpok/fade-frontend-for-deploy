import { ModalProvider } from '@Components/ModalProvider';
import { ToastProvider } from '@Components/ToastProvider';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div id="rootLayout" className="relative mx-auto h-1 min-h-dvh w-full overflow-hidden border border-x pt-[var(--sat)] md:max-w-[48rem]">
      <Outlet />
      <ModalProvider />
      <ToastProvider />
    </div>
  );
}
