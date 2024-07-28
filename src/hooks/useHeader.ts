import { useHeaderStore } from '@Stores/header';
import { ReactNode, useLayoutEffect } from 'react';

type UseHeaderProps = { title?: string; leftSlot?: () => ReactNode; rightSlot?: () => ReactNode };

export function useHeader({ title, leftSlot, rightSlot }: UseHeaderProps) {
  const setTitle = useHeaderStore((state) => state.setTitle);
  const setLeftSlot = useHeaderStore((state) => state.setLeftSlot);
  const setRightSlot = useHeaderStore((state) => state.setRightSlot);

  useLayoutEffect(() => {
    setTitle(title);
    setLeftSlot(leftSlot);
    setRightSlot(rightSlot);
  }, [title, leftSlot, rightSlot]);
}
