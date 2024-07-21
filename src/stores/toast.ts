import { ReactNode } from 'react';
import { create } from 'zustand';

export type OpenToastParams = Omit<ToastItem, 'id' | 'isOpen'>;

export type ToastItem = {
  id: string;
  type: 'success' | 'error' | 'basic' | 'welcome';
  title: string;
  description?: string;
  duration?: number;
  actionSlot?: () => ReactNode;
};

type ToastStore = {
  toasts: ToastItem[];
  addToast: (toast: ToastItem) => void;
  removeToast: (toastId: string) => void;
};

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast(toast) {
    set({ toasts: [...get().toasts, { ...toast }] });
  },

  removeToast(toastId) {
    set({ toasts: [...get().toasts.filter((toast) => toast.id !== toastId)] });
  },
}));
