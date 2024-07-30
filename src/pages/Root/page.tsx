import { useAuthActions, useIsAuthenticated } from '@Hooks/auth';
import { useToastActions } from '@Hooks/toast';
import { setAuthorizationHeader } from '@Libs/axios';
import { requestRefreshToken } from '@Services/auth';
import { LoaderResponseStatus } from '@Types/loaderResponse';
import { clearSearchParams, createErrorLoaderResponse, createSuccessLoaderResponse, tryCatcher } from '@Utils/index';
import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

export async function loader() {
  const [response, errorResponse] = await tryCatcher(() => requestRefreshToken());

  if (response) {
    return createSuccessLoaderResponse(response.data);
  }

  return createErrorLoaderResponse(errorResponse);
}

export default function Page() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { showToast } = useToastActions();

  const { status, payload } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { signIn } = useAuthActions();

  useEffect(() => {
    if (status === LoaderResponseStatus.ERROR) {
      const { errorCode } = payload.result;

      if (errorCode === 'TOKEN_NOT_EXIST') {
        return navigate('/login', { replace: true });
      }

      /** 위로 에러 던지기 */
      throw payload;
    }

    const shouldSignIn = !isAuthenticated && status === LoaderResponseStatus.SUCCESS;

    if (shouldSignIn) {
      signIn(payload!);
      clearSearchParams();
      setAuthorizationHeader({ accessToken: payload.accessToken });
    }

    navigate('/vote-fap');
    showToast({ type: 'welcome', title: `환영환영` });
  }, []);

  return <></>;
}
