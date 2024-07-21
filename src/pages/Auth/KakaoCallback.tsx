import { LoaderResponseStatus } from '@Types/loaderResponse';
import { useAuthActions } from '@Hooks/auth';
import { requestSignInWithCode } from '@Services/authAPI';
import { createErrorLoaderResponse, createSuccessLoaderResponse, tryCatcher } from '@Utils/index';
import { useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');

  if (authorizationCode === null) {
    return createErrorLoaderResponse({ errorCode: 'custom_error_code_1' });
  }

  const [response, errorCode] = await tryCatcher(() => requestSignInWithCode({ authorizationCode }));

  if (response) {
    return createSuccessLoaderResponse(response.data);
  }

  return createErrorLoaderResponse({ errorCode });
}

export default function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { status, payload } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { signIn } = useAuthActions();

  useEffect(() => {
    const isValidAccess = status === LoaderResponseStatus.SUCCESS;

    if (isValidAccess) {
      signIn(payload);
      return navigate('/', { replace: true });
    }

    return navigate(`/signup?code=${searchParams.get('code')}`, { replace: true });
  }, [status, payload]);

  return <></>;
}
