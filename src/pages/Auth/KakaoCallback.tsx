import { useAuthActions } from '@Hooks/auth';
import { requestSignInWithCode } from '@Services/auth';
import { LoaderResponseStatus } from '@Types/loaderResponse';
import { isErrorWithData } from '@Types/serviceError';
import { createErrorLoaderResponse, createSuccessLoaderResponse, tryCatcher } from '@Utils/index';
import { useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');

  /** 비정상적인 접근 */
  if (authorizationCode === null) {
    return null;
  }

  const [response, errorResponse] = await tryCatcher(() => requestSignInWithCode({ authorizationCode }));

  if (response) {
    return createSuccessLoaderResponse(response.data);
  }

  return createErrorLoaderResponse(errorResponse);
}

export default function KakaoCallback() {
  const navigate = useNavigate();

  const loaderResponse = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { signIn } = useAuthActions();

  useEffect(() => {
    /** 비정상적인 접근 */
    if (loaderResponse === null) {
      return navigate('/', { replace: true });
    }

    const { status, payload } = loaderResponse;
    const isValidAccess = status === LoaderResponseStatus.SUCCESS;

    /** 기존 회원 로그인 */
    if (isValidAccess) {
      signIn(payload);
      return navigate('/', { replace: true });
    }

    /** 신규 회원가입 */
    const { result } = payload;

    if (isErrorWithData(result, 'NOT_MATCH_SOCIAL_MEMBER')) {
      const { socialAccessToken } = result.data;
      return navigate('/signup', { state: { socialAccessToken }, replace: true });
    }
  }, [loaderResponse]);

  return <></>;
}
