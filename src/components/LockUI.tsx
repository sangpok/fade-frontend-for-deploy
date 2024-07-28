import { MdLock } from 'react-icons/md';

export default function LockUI() {
  return (
    <div className="grid min-h-screen place-content-center gap-3 bg-gradient-to-br from-white to-purple-50">
      <div className="mx-auto">
        <MdLock className="size-24 text-purple-500" />
      </div>
      <div className="space-y-0.5 px-2">
        <p className="text-center text-h2 font-medium">오늘의 투표를 완료해주세요!</p>
        <p className="text-center text-h6 font-light leading-tight text-gray-900">하루 최소 1사이클(10회) 이상 FA:P 투표를 완료해야 다른 기능을 이용할 수 있어요.</p>
      </div>
    </div>
  );
}
