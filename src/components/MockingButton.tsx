import * as Popover from '@radix-ui/react-popover';
import { useVotingStore } from '@Stores/vote';
import { removeLocalData } from '@Utils/index';
import { useEffect, useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { Button } from './ui/button';

export function MockingButton() {
  const setHasVotedToday = useVotingStore((state) => state.setHasVotedToday);
  const [isMockingEnabled, setIsMockingEnabled] = useState(false);

  useEffect(() => {
    const handleMockingStart = () => setIsMockingEnabled(true);
    const handleMockingEnd = async () => {
      setIsMockingEnabled(false);

      // MSW 중지
      const { worker } = await import('@/__mock__/instance');
      worker.stop();

      // 로컬 데이터 삭제
      removeLocalData('_fert');
      removeLocalData('FADE_VOTE_COUNT');
      removeLocalData('FADE_LAST_VOTED_AT');
      removeLocalData('FADE_LAST_FAP_DATE');
      removeLocalData('FADE_VOTE_DATA');
      removeLocalData('FADE_SEARCH_HISTORY');

      location.reload();
    };

    window.addEventListener('mockingStart', handleMockingStart);
    window.addEventListener('mockingEnd', handleMockingEnd);

    return () => {
      window.removeEventListener('mockingStart', handleMockingStart);
      window.removeEventListener('mockingEnd', handleMockingEnd);
    };
  }, []);

  if (!isMockingEnabled) {
    return null;
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variants="outline" interactive="onlyScale" size="icon" className="pointer-events-auto border border-red-400 bg-red-300 shadow-2xl">
          <MdSettings />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="translate-y-2 rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
          <Popover.Arrow className="fill-white stroke-gray-200" />
          <p className="mb-3 whitespace-pre-line text-center text-detail">{`서비스 둘러보기 시에만\n나타나는 테스트 버튼입니다`}</p>
          <ul className="flex flex-col">
            <li className="w-full">
              <Button variants="ghost" className="w-full" onClick={() => setHasVotedToday(true)}>
                Bypass the vote check today
              </Button>
            </li>
            <li className="w-full">
              <Button variants="ghost" className="w-full" onClick={() => removeLocalData('FADE_LAST_FAP_DATE')}>
                Reset yesterday's FA:P alerts
              </Button>
            </li>
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
