import { ModalType } from '@Stores/modal';
import { cn } from '@Utils/index';
import { motion, Variants } from 'framer-motion';
import { Children, PropsWithChildren, ReactElement, useEffect, useRef, useState } from 'react';

const slideUpVariants: Variants = {
  hide: { y: '100%', scale: '85%', opacity: '80%', transformOrigin: 'bottom' },
  // show: { y: 0, scale: '100%', height: 'auto', opacity: '100%' },
  show: (height: number | null) => ({ y: 0, scale: '100%', height: height || '100%', opacity: '100%' }),
  exit: { y: '100%', scale: '85%', opacity: '80%', transition: { duration: 0.2 } },
};

const slideInFromRightVariants: Variants = {
  hide: { x: '100%', scale: '85%', opacity: '80%', transformOrigin: 'right' },
  show: { x: '0', scale: '100%', opacity: '100%' },
  exit: { x: '100%', scale: '85%', opacity: '80%', transition: { duration: 0.2 } },
};

const showAtCenterVariants: Variants = {
  hide: { opacity: 0, scale: '85%', y: '-50%', transformOrigin: 'bottom' },
  show: { opacity: '100%', scale: '100%', y: '-50%' },
  exit: { opacity: 0, scale: '85%' },
};

export type AnimateType = 'slideUp' | 'slideInFromRight' | 'showAtCenter';

const variantsMap: Record<AnimateType, Variants> = {
  slideUp: slideUpVariants,
  slideInFromRight: slideInFromRightVariants,
  showAtCenter: showAtCenterVariants,
};

type AnimatedDialogProps = {
  animateType?: AnimateType;
  modalType?: ModalType;
  onStartAnimationEnd?: () => void;
};

export function AnimatedDialog({ animateType = 'slideUp', modalType = 'fullScreenDialog', onStartAnimationEnd, children }: PropsWithChildren<AnimatedDialogProps>) {
  const isFullScreenDialog = modalType === 'fullScreenDialog';
  const isBottomSheet = modalType === 'bottomSheet';
  const isComponent = modalType === 'component';

  const childRef = useRef<HTMLDivElement>(null);
  const childElement = Children.only(children) as ReactElement;
  const ChildComponent = childElement.type;
  const childProps = childElement.props;

  const [boundHeight, setBoundHeight] = useState(0);

  useEffect(() => {
    if (!childRef.current) return;

    const childResizeObserver = new ResizeObserver(([entry]) => {
      const {
        contentRect: { height: childHeight },
      } = entry;

      setBoundHeight(childHeight);
    });

    childResizeObserver.observe(childRef.current, { box: 'border-box' });

    return () => childResizeObserver.disconnect();
  }, []);

  return (
    <motion.div
      layout
      initial="hide"
      animate="show"
      exit="exit"
      variants={variantsMap[animateType]}
      custom={boundHeight}
      onAnimationComplete={(definition) => definition === 'show' && onStartAnimationEnd && onStartAnimationEnd()}
      className={cn('pointer-events-auto absolute flex w-full flex-col bg-white', {
        ['bottom-0 left-0 h-full pt-[var(--sat)]']: isFullScreenDialog,
        ['bottom-0 left-0 rounded-t-2xl']: isBottomSheet,
        ['top-1/2 mx-5 h-fit w-full max-w-[calc(100%-2.5rem)] rounded-2xl']: isComponent,
      })}>
      {isBottomSheet && <ChildComponent ref={childRef} {...childProps} />}
      {isFullScreenDialog && children}
      {isComponent && children}
    </motion.div>
  );
}
