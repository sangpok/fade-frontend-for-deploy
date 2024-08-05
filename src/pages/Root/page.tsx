import { useAuthActions, useIsAuthenticated } from '@Hooks/auth';
import { useToastActions } from '@Hooks/toast';
import { clearAuthorizationHeader } from '@Libs/axios';
import { requestRefreshToken } from '@Services/auth';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AuthTokens } from '@Types/model';
import { ServiceErrorResponse } from '@Types/serviceError';
import { getPayloadFromJWT } from '@Utils/index';
import { isAxiosError } from 'axios';
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

/**
 * 최초 서비스 접속 시 온보딩으로 보낼지, 메인 서비스로 보낼지 판단하는 페이지
 */

export default function Page() {
  const isAuthenticated = useIsAuthenticated();
  const savedRefreshToken = atob(localStorage.getItem('_fert') || ''); // 암호화된 RT를 특정하지 못하도록 키를 줄임, FADE Encrypted Refresh Token

  if (isAuthenticated) {
    return <Navigate to="/vote-fap" />;
  }

  if (savedRefreshToken === '') {
    return <Navigate to="/login" />;
  }

  return <TokenHandler savedRefreshToken={savedRefreshToken} />;
}

/**
 * Case 1. 기존 Refresh Token이 존재하는 경우
 *    : /auth/token에 요청
 *
 * Case 2: 기존 Refresh Token이 존재하지 않는 경우
 *    : 로그인할 정보가 없으므로 redirect to /login
 */

interface TTokenHandler {
  savedRefreshToken: string;
}

type TokenHandlerProps = TTokenHandler;

function TokenHandler({ savedRefreshToken }: TokenHandlerProps) {
  const navigate = useNavigate();
  const { showToast } = useToastActions();
  const { signIn } = useAuthActions();

  const {
    data: { data: authTokens },
    isSuccess,
    isError,
    error,
  } = useSuspenseQuery({
    queryKey: ['auth', 'token', savedRefreshToken],
    staleTime: 50 * 60 * 1000, // 59 minutes
    queryFn: () => requestRefreshToken({ refreshToken: savedRefreshToken }),
  });

  useEffect(() => {
    if (isError) {
      handleError(error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && authTokens) {
      handleSuccess(authTokens);
    }
  }, [isSuccess, authTokens]);

  const handleError = (error: unknown) => {
    if (isAxiosError<ServiceErrorResponse>(error)) {
      if (error.response) {
        const { errorCode } = error.response.data.result;
        if (errorCode === 'TOKEN_NOT_EXIST') {
          clearAuthorizationHeader();
          navigate('/login', { replace: true });
          return;
        }
      }
      if (error.request) {
        throw error;
      }
    }
    throw error;
  };

  const handleSuccess = (tokens: AuthTokens) => {
    signIn(tokens);
    const { username } = getPayloadFromJWT(tokens.accessToken);
    showToast({ type: 'welcome', title: `${username}님, 환영합니다!` });
    navigate('/vote-fap');
  };

  return null;
}
