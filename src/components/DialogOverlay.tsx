import { motion, Variants } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * Radix의 Overflow Component를 사용하면모달 본문의 스크롤이 동작하지 않는다. ㅡㅅ ㅡ
 * style에 overflow: auto를 넣으면 해결된다는데, 내 경우엔 해결이 안 돼서
 * 그냥 없이 사용하기로 함.
 */

const variants: Variants = {
  opacityOut: { opacity: 0 },
  opacityIn: { opacity: 1 },
};

type DialogOverlayProp = {
  onClick?: () => void;
};

export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProp>(({ onClick }: DialogOverlayProp, ref) => {
  return (
    <motion.div
      ref={ref}
      key="overlay"
      variants={variants}
      initial="opacityOut"
      animate="opacityIn"
      exit="opacityOut"
      className="fixed inset-0 overflow-auto bg-black/50"
      onClick={() => onClick && onClick()}
    />
  );
});
