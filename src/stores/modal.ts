/* eslint-disable  @typescript-eslint/no-explicit-any */

import { AnimateType } from '@Components/AnimatedDialog';
import { ComponentType } from 'react';
import { create } from 'zustand';

/**
 * Dev note:
 * 많은 방법을 물색해봤지만 modal이 어떤 값을 반환하고 어떤 Prop을 갖는지 명시하긴 어려웠음
 * 특히 Zustand에서는 Store 자체에 Generic을 설정할 수 없어서,
 * Store 내부에 있는 타입들이 유기적으로 타입 추론이 되긴 어려웠음.
 * -> modals를 type assert 해준다고 한들 addModal은 되지 않음
 *
 * 그러므로 택한 방법이 ,, 개발자가 Type이 필요한 부분은 (1) 모달을 호출하는 부분과 (2) 모달 내부밖에 없음.
 * (1)은 useModalActions()의 showModal()과 같이 Generic하게 처리하고,
 * (2)는 DefaultModalProps<ReturnType, Prop>으로 해결함.
 *
 * 그러기 위해선 any 덕칠을 ㅎ..ㅎ
 */

/** 모달 타입  */
export type ModalType = 'fullScreenDialog' | 'bottomSheet' | 'component';

/** T: 반환값 / P: Props */
export type DefaultModalProps<T = unknown, P = Record<string, unknown>> = {
  isStartAnimtionEnd: boolean;
  setCloseHandler: (handler: () => () => Promise<boolean>) => void;
  onClose: (value?: T) => void;
  onSubmitSuccess: (value?: T) => void;
} & P;

/** type에 따라 animateType을 제한하고 싶은데 ... 모르겠다 */
// interface BaseModalTypeWithAnimate {
//   type: ModalType;
//   animateType: AnimateType;
// }

// interface FullScreenDialogAnimate extends BaseModalTypeWithAnimate {
//   type: 'fullScreenDialog';
//   animateType: 'slideUp' | 'slideInFromRight';
// }

// interface BottomSheetAnimate extends BaseModalTypeWithAnimate {
//   type: 'bottomSheet';
//   animateType: 'slideUp';
// }

// interface ComponentAnimate extends BaseModalTypeWithAnimate {
//   type: 'component';
//   animateType: 'showAtCenter';
// }

// type ModalTypeWithAnimate = FullScreenDialogAnimate | BottomSheetAnimate | ComponentAnimate;

/** T: 반환값 / P: Props */
export type ModalItem<T = any, P = Record<string, unknown> | any> = {
  id: string;
  type: ModalType;
  animateType?: AnimateType;
  props?: P;
  resolve: (value: T | PromiseLike<T>) => void;
  Component: ComponentType<DefaultModalProps<T, P>>;
};

type ModalStoreType<T = any, P = Record<string, unknown> | any> = {
  modals: ModalItem<T, P>[];
  addModal: (modal: ModalItem<T, P>) => void;
  removeModal: (modalId: string) => void;
};

export const useModalStore = create<ModalStoreType<any, any>>((set) => ({
  modals: [],

  addModal(modal) {
    set((state) => ({ modals: [...state.modals, { ...modal }] }));
  },

  removeModal(modalId) {
    set((state) => ({ modals: [...state.modals.filter(({ id }) => id !== modalId)] }));
  },
}));
