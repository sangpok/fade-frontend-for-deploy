import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative px-5 py-4">
          <p className="text-center text-lg font-semibold">존재하지 않는 페이지</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium">어라, 존재하지 않는 페이지로 들어오셨어요!</p>
          <p>경로를 다시 확인해주시거나 아래의 버튼을 통해 이동해주세요.</p>

          <Link to="/" className="rounded-lg bg-purple-500 px-6 py-2 font-semibold text-white">
            메인 홈으로 돌아가기
          </Link>
        </div>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}
