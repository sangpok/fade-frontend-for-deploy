import { useHeader } from '@Hooks/useHeader';
import { MdLock } from 'react-icons/md';
import { useLocation } from 'react-router-dom';

const titleMap: Record<string, string> = {
  '/archive': 'FA:P 아카이브',
  '/subscribe': '구독',
  '/mypage': '마이페이지',
};

export default function LockUI() {
  const location = useLocation();
  useHeader({ title: titleMap[location.pathname] });

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-white to-purple-50 p-5">
      <MdLock className="size-24 text-purple-500" />

      <div className="space-y-0.5 px-2">
        <p className="text-center text-h2 font-semibold">오늘의 투표를 완료해주세요!</p>
        <p className="text-center text-h6">하루 최소 1사이클(10회) 이상 FA:P 투표를 완료해야 다른 기능을 이용할 수 있어요.</p>
      </div>
    </div>
  );
}
