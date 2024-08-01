import * as Popover from '@radix-ui/react-popover';
import { Button } from './ui/button';
import { MdSettings } from 'react-icons/md';
import { useRef, useState } from 'react';
import { cn } from '@Utils/index';
import { useVotingStore } from '@Stores/vote';

const LOCALSTORAGE_KEY = 'FADE_API_MOCKING_ENABLED' as const;

export function MockingButton() {
  const mockButtonRef = useRef<HTMLButtonElement>(null);
  const setHasVotedToday = useVotingStore((state) => state.setHasVotedToday);

  const [isMockEnabled, setIsMockEnabled] = useState(() => {
    return (localStorage.getItem(LOCALSTORAGE_KEY) as 'true' | 'false' | undefined) === 'true' ? true : false;
  });

  const handleClick = async () => {
    if (mockButtonRef.current === null) {
      return;
    }

    const { worker } = await import('../__mock__/instance');

    isMockEnabled && worker.stop();
    !isMockEnabled && worker.start({ onUnhandledRequest: 'bypass' });

    setIsMockEnabled((prev) => !prev);
    localStorage.setItem(LOCALSTORAGE_KEY, String(!isMockEnabled));
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          variants="outline"
          interactive="onlyScale"
          size="icon"
          className={cn('pointer-events-auto border border-gray-200 bg-white shadow-2xl', {
            ['border-red-400 bg-red-300']: isMockEnabled,
          })}>
          <MdSettings />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="translate-y-2 rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
          <Popover.Arrow className="fill-white stroke-gray-200" />
          <ul className="flex flex-col">
            <li className="w-full">
              <Button
                ref={mockButtonRef}
                aria-checked={(localStorage.getItem('FADE_API_MOCKING_ENABLED') as 'true' | 'false' | undefined) || 'false'}
                variants="ghost"
                className={cn('w-full', { ['text-pink-400']: isMockEnabled })}
                onClick={handleClick}>
                {isMockEnabled ? 'Disable' : 'Enable'} API Mocking
              </Button>
            </li>
            <li className="w-full">
              <Button variants="ghost" className="w-full" onClick={() => location.reload()}>
                Page Reload
              </Button>
            </li>
            <li className="w-full">
              <Button variants="ghost" className="w-full" onClick={() => setHasVotedToday(true)}>
                Bypass the vote check today
              </Button>
            </li>
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
