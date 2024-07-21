import { ReactNode } from 'react';
import { create } from 'zustand';

type SlotType = () => ReactNode;

export type HeaderStore = {
  title: string | undefined;
  leftSlot: SlotType | undefined;
  rightSlot: SlotType | undefined;

  setTitle: (title: string | undefined) => void;
  setLeftSlot: (slot: SlotType | undefined) => void;
  setRightSlot: (slot: SlotType | undefined) => void;
};

export const useHeaderStore = create<HeaderStore>((set) => ({
  title: undefined,
  leftSlot: undefined,
  rightSlot: undefined,

  setTitle: (title) => set({ title }),
  setLeftSlot: (leftSlot) => set({ leftSlot }),
  setRightSlot: (rightSlot) => set({ rightSlot }),
}));
