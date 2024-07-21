import { OpenToastParams, useToastStore } from '@Stores/toast';
import { generateRandomId } from '@Utils/index';

export function useToasts() {
  return useToastStore((state) => state.toasts);
}

export function useToastActions() {
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);

  const showToast = (params: OpenToastParams) => {
    const newId = generateRandomId();

    addToast({ id: newId, duration: 3000, ...params });

    return newId;
  };

  const closeToast = (toastId: string) => {
    removeToast(toastId);
  };

  return { showToast, closeToast };
}
