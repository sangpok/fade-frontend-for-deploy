import { useHeaderStore } from '@Stores/header';
import { useEffect } from 'react';

export function Header() {
  const leftSlot = useHeaderStore((state) => state.leftSlot);
  const rightSlot = useHeaderStore((state) => state.rightSlot);
  const title = useHeaderStore((state) => state.title);
  const subSlot = useHeaderStore((state) => state.subSlot);
  const isSubSlotVisible = useHeaderStore((state) => state.isSubSlotVisible);

  const isTitleString = typeof title === 'string';
  const isTitleSlot = typeof title === 'function';

  const wouldShowSubSlot = subSlot && isSubSlotVisible;

  return (
    <>
      {isSubSlotVisible && <BackgroundOverlay />}

      <header className="relative bg-white py-2">
        {leftSlot && <div className="absolute left-3 top-1/2 -translate-y-1/2">{leftSlot()}</div>}
        {isTitleString && <p className="text-center text-lg font-semibold">{title}</p>}
        {isTitleSlot && <div className="mx-auto w-fit">{title()}</div>}
        {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot()}</div>}

        {wouldShowSubSlot && <div className="absolute top-full w-full">{subSlot()}</div>}
      </header>
    </>
  );
}

function BackgroundOverlay() {
  const setIsSubSlotVisible = useHeaderStore((state) => state.setIsSubSlotVisible);

  useEffect(() => {
    const handleKeyUp = ({ key }: KeyboardEvent) => key === 'Escape' && setIsSubSlotVisible(false);
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);

  return <div className="absolute inset-0 bg-gray-900/50" onClick={() => setIsSubSlotVisible(false)} />;
}
