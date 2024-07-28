import { useToastActions } from '@Hooks/toast';
import { isAxiosError } from 'axios';
import { PropsWithChildren, useEffect } from 'react';

/**
 * 비동기에서 발생하는 에러를 핸들링합니다.
 *
 * 기본적으로 tryCatcher 또는 React Query에서 API 에러를 잡아내고,
 * Network Error가 발생하면 서비스 내에서 제어할 수 없는 에러이므로 AsyncErrorBoundary에서 잡아서 유저에게 알립니다.
 * 이 외 글로벌한 에러가 발생한다면 React Router Dom의 최상위 errorElement가 렌더링됩니다.
 */

export function AsyncErrorBoundary({ children }: PropsWithChildren) {
  const { showToast } = useToastActions();

  const captureReject = (e: PromiseRejectionEvent) => {
    e.preventDefault();

    if (isAxiosError(e.reason)) {
      return showToast({
        type: 'error',
        title: `알 수 없는 오류(${e.reason.name})`,
        description: `서비스 내 알 수 없는 오류가 발생했어요.\n${e.reason.message} - ${new URL(e.reason.config?.url || import.meta.env.VITE_API_BASE_URL).pathname}`,
      });
    }

    console.log('EB >> ', e.reason);

    showToast({ type: 'error', title: '알 수 없는 오류', description: '서비스 내 알 수 없는 오류가 발생했어요.' });
  };

  useEffect(() => {
    window.addEventListener('unhandledrejection', captureReject);
    return () => window.removeEventListener('unhandledrejection', captureReject);
  }, []);

  return children;
}
