import { useToastActions, useToasts } from '@Hooks/toast';
import * as RadixToast from '@radix-ui/react-toast';
import { Toast } from './ui/toast';
import { AnimatePresence } from 'framer-motion';

export function ToastProvider() {
  const toasts = useToasts();
  const { closeToast } = useToastActions();

  return (
    <RadixToast.Provider>
      <AnimatePresence mode="popLayout">
        {toasts.map((value) => (
          <Toast key={value.id} value={value} onClose={closeToast} />
        ))}
      </AnimatePresence>

      <RadixToast.Viewport className="absolute bottom-0 left-0 flex w-full flex-col gap-3 px-5 py-[5.25rem]" />
    </RadixToast.Provider>
  );
}
