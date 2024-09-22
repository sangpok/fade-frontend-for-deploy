import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export default function GlobalErrorPage() {
  const error = useRouteError();

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <p className="text-center text-lg font-semibold">FADE</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p className="text-lg font-medium">어라, 개발자가 놓친 오류를 발견하셨어요!</p>

          {isRouteErrorResponse(error) ? (
            <h1>
              {error.status} {error.statusText}
            </h1>
          ) : (
            <h1>{(error as Error).message || String(error)}</h1>
          )}

          <Link to="/" className="rounded-lg bg-purple-500 px-6 py-2 font-semibold text-white">
            메인 홈으로 돌아가기
          </Link>
        </div>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}
