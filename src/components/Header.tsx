import { useHeaderStore } from '@Stores/header';

export function Header() {
  const leftSlot = useHeaderStore((state) => state.leftSlot);
  const rightSlot = useHeaderStore((state) => state.rightSlot);
  const title = useHeaderStore((state) => state.title);

  return (
    <header className="relative px-5 py-4">
      {leftSlot && <div className="absolute left-5 top-1/2 -translate-y-1/2">{leftSlot()}</div>}
      {title && <p className="text-center text-2xl font-semibold">{title}</p>}
      {rightSlot && <div className="absolute right-5 top-1/2 -translate-y-1/2">{rightSlot()}</div>}
    </header>
  );
}
