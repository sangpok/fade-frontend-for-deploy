import { ConfirmModal } from '@Components/ConfirmModal';
import { ModalItem, useModalStore } from '@Stores/modal';
import { generateRandomId } from '@Utils/index';

export function useModalActions() {
  const addModal = useModalStore((state) => state.addModal);

  /** T: Expected Return Type */
  const showModal = <T>(modal: Omit<ModalItem, 'id' | 'resolve'>) => {
    return new Promise<T | undefined>((resolve) => {
      const newModal: ModalItem = {
        ...modal,
        id: generateRandomId(),
        resolve,
        animateType: modal.type === 'bottomSheet' ? 'slideUp' : modal.type === 'component' ? 'showAtCenter' : modal.animateType || 'slideUp',
      };

      addModal(newModal);
    });
  };

  return { showModal };
}

export function useConfirm() {
  const { showModal } = useModalActions();

  const confirm = ({ title, description }: { title: string; description?: string }) => {
    return showModal<boolean>({ type: 'component', Component: ConfirmModal, props: { title, description } });
  };

  return confirm;
}
