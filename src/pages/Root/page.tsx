import { useAuthActions, useIsAuthenticated } from '@Hooks/auth';
import { useToastActions } from '@Hooks/toast';
import { requestRefreshToken } from '@Services/authAPI';
import { LoaderResponseStatus } from '@Types/loaderResponse';
import { clearSearchParams, createErrorLoaderResponse, createSuccessLoaderResponse, tryCatcher } from '@Utils/index';
import { useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const shouldNotRefreshToken = searchParams.get('norefreshtoken') !== null;

  if (shouldNotRefreshToken) {
    return createSuccessLoaderResponse(null);
  }

  const [response, errorCode] = await tryCatcher(() => requestRefreshToken());

  /** tryCatcher를 쓰면,, 아래의 구분을 안 해도 될 것 같기도 하고 ;ㅅ; */
  if (response) {
    return createSuccessLoaderResponse(response.data);
  }

  return createErrorLoaderResponse({ errorCode });
}

export default function Page() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { showToast } = useToastActions();

  const { status, payload } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { signIn } = useAuthActions();

  useEffect(() => {
    if (status === LoaderResponseStatus.ERROR) {
      if (payload.errorCode === 'no_refresh_token') {
        return navigate('/login', { replace: true });
      }

      /** 위로 에러 던지기 */
      throw new Error(payload.errorCode);
    }

    const shouldSignIn = !isAuthenticated && status === LoaderResponseStatus.SUCCESS;

    if (shouldSignIn) {
      signIn(payload!);
      clearSearchParams();
    }

    navigate('/vote-fap');
    showToast({ type: 'welcome', title: `환영환영` });
  }, []);

  return <></>;
}
