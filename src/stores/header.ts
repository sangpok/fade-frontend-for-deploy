import { ReactNode } from 'react';
import { create } from 'zustand';

type SlotType = () => ReactNode;

export type HeaderStore = {
  title?: string | SlotType;
  leftSlot?: SlotType;
  rightSlot?: SlotType;
  subSlot?: SlotType;

  isSubSlotVisible?: boolean;

  setTitle: (title?: string | SlotType) => void;
  setLeftSlot: (slot?: SlotType) => void;
  setRightSlot: (slot?: SlotType) => void;
  setSubSlot: (slot?: SlotType) => void;

  setIsSubSlotVisible: (visible: boolean) => void;
};

export const useHeaderStore = create<HeaderStore>((set) => ({
  title: undefined,
  leftSlot: undefined,
  rightSlot: undefined,
  subSlot: undefined,

  isSubSlotVisible: false,

  setTitle: (title) => set({ title }),
  setLeftSlot: (leftSlot) => set({ leftSlot }),
  setRightSlot: (rightSlot) => set({ rightSlot }),
  setSubSlot: (subSlot) => set({ subSlot }),

  setIsSubSlotVisible: (isSubSlotVisible) => set({ isSubSlotVisible }),
}));
