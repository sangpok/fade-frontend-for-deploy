import * as RadixToast from '@radix-ui/react-toast';
import { ToastItem } from '@Stores/toast';
import { cn } from '@Utils/index';
import { motion, Variants } from 'framer-motion';
import { ElementRef, forwardRef } from 'react';
import { MdCheckCircleOutline, MdClose, MdReport } from 'react-icons/md';

const variants: Variants = {
  hide: { x: '100%', opacity: 0 },
  show: { x: 0, opacity: 1 },
  exit: { opacity: 0 },
};

export const Toast = forwardRef<ElementRef<typeof RadixToast.Root>, { value: ToastItem; onClose: (id: string) => void }>(
  ({ value, onClose }: { value: ToastItem; onClose: (id: string) => void }, ref) => {
    const isBasic = value.type === 'basic';
    const isSuccess = value.type === 'success';
    const isError = value.type === 'error';
    const isWelcome = value.type === 'welcome';

    const wouldShowClose = value.actionSlot === undefined;
    const wouldShowAction = value.actionSlot !== undefined;

    return (
      <RadixToast.Root ref={ref} duration={2500} forceMount asChild onOpenChange={() => onClose(value.id)}>
        <motion.li
          layout
          variants={variants}
          initial="hide"
          animate="show"
          exit="exit"
          className={cn('flex w-full flex-row items-center justify-center gap-1 rounded-md px-4 py-3', {
            ['bg-black text-white']: isBasic || isSuccess,
            ['bg-pink-600 text-white']: isError,
            ['bg-purple-700 text-white']: isWelcome,
          })}>
          {isSuccess && <MdCheckCircleOutline className="size-6 text-purple-700" />}
          {isError && <MdReport className="size-6" />}

          <RadixToast.Title className="flex-1">{value.title}</RadixToast.Title>

          {value.description && <RadixToast.Description>{value.description}</RadixToast.Description>}

          {wouldShowAction && value.actionSlot!()}
          {wouldShowClose && (
            <RadixToast.Close>
              <MdClose />
            </RadixToast.Close>
          )}
        </motion.li>
      </RadixToast.Root>
    );
  }
);
