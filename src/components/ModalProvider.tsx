import { AnimatedDialog } from '@Components/AnimatedDialog';
import { DialogOverlay } from '@Components/DialogOverlay';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ModalItem, useModalStore } from '@Stores/modal';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function ModalProvider() {
  const modals = useModalStore((state) => state.modals);

  return (
    <>
      <div id="portalSection" />

      {modals.map((modal) => (
        <Modal key={modal.id} {...modal} />
      ))}
    </>
  );
}

function Modal({ Component, id, type, props, resolve, animateType }: ModalItem) {
  const removeModal = useModalStore((state) => state.removeModal);

  const [isStartAnimtionEnd, setIsStartAnimtionEnd] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [closeHandler, setCloseHandler] = useState<(() => Promise<boolean>) | null>(null);

  /** @param params any or undefined */
  const handleClose = async (params?: unknown) => {
    if (closeHandler && !(await closeHandler())) {
      return;
    }

    setIsOpen(false);
    resolve(params);
  };

  const handleSubmitSuccess = () => {
    setIsOpen(false);
    resolve(undefined);
  };

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(value) => !value && handleClose()}>
      {/* 실제로 Modal 데이터가 지워지는 건 Animate가 끝난 후 */}
      <AnimatePresence onExitComplete={() => removeModal(id)}>
        {isOpen && (
          <AlertDialog.Portal forceMount container={document.getElementById('portalSection')!}>
            <AlertDialog.Overlay>
              <DialogOverlay onClick={() => handleClose()} />
            </AlertDialog.Overlay>

            <AlertDialog.Title />

            <AlertDialog.Content>
              <VisuallyHidden>
                <AlertDialog.AlertDialogDescription>This description is hidden from sighted users but accessible to screen readers.</AlertDialog.AlertDialogDescription>
              </VisuallyHidden>

              <AnimatedDialog modalType={type} animateType={animateType} onStartAnimationEnd={() => setIsStartAnimtionEnd(true)}>
                <Component
                  {...(props || {})}
                  isStartAnimtionEnd={isStartAnimtionEnd}
                  setCloseHandler={setCloseHandler}
                  onClose={handleClose}
                  onSubmitSuccess={handleSubmitSuccess}
                />
              </AnimatedDialog>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
}
