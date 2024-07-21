import { create } from 'zustand';

export type ConfirmState = {
  isOpen: boolean;
  title: string;
  description: string;
  resolve: ((value: boolean) => void) | null;
};

type ConfirmStore = {
  confirmState: ConfirmState | null;
  confirm: ({ title, description }: { title: string; description: string }) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
};

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  confirmState: null,

  confirm({ title, description }) {
    return new Promise<boolean>((resolve) => {
      set({ confirmState: { isOpen: true, title, description, resolve } });
    });
  },

  handleConfirm() {
    const { confirmState } = get();

    if (confirmState?.resolve) {
      confirmState.resolve(true);
    }

    set({ confirmState: null });
  },

  handleCancel() {
    const { confirmState } = get();

    if (confirmState?.resolve) {
      confirmState.resolve(false);
    }

    set({ confirmState: null });
  },
}));
