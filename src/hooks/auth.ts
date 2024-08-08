import { clearAuthorizationHeader, setAuthorizationHeader } from '@Libs/axios';
import { queryClient } from '@Libs/queryclient';
import { requestRefreshToken } from '@Services/auth';
import { useAuthStore } from '@Stores/auth';
import { AuthTokens } from '@Types/model';
import { ServiceErrorResponse } from '@Types/serviceError';
import { removeLocalData, saveLocalData } from '@Utils/index';
import { isAxiosError } from 'axios';
import { useCallback, useMemo } from 'react';

export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);

export const useIsAuthenticated = () => {
  const user = useUser();
  return useMemo(() => user.id !== -1, [user]);
};

export const useAuthActions = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setAuthFromToken = useAuthStore((state) => state.setAuthFromToken);
  const resetAuth = useAuthStore((state) => state.resetAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const signIn = useCallback(
    ({ accessToken, refreshToken }: AuthTokens) => {
      setTokens({ accessToken, refreshToken });
      setAuthFromToken({ accessToken });
      setAuthorizationHeader({ accessToken });
      saveLocalData('_fert', btoa(refreshToken));
    },
    [setTokens, setAuthFromToken]
  );

  const signOut = useCallback(() => {
    resetAuth();
    clearAuthorizationHeader();
    removeLocalData('_fert');
  }, [resetAuth]);

  const doRefreshToken = useCallback(async () => {
    try {
      const { data: authTokens } = await queryClient.fetchQuery({
        queryKey: ['auth', 'token', refreshToken],
        queryFn: () => requestRefreshToken({ refreshToken: refreshToken! }),
      });

      signIn(authTokens);
      return true;
    } catch (error) {
      if (isAxiosError<ServiceErrorResponse>(error)) {
        /** API 오류 */
        if (error.response) {
          const { errorCode } = error.response.data.result;

          if (errorCode === 'TOKEN_NOT_EXIST') {
            clearAuthorizationHeader();
            return false;
          }
        }

        /** 네트워크 오류(disconnected, timeout, cors, etc...) */
        if (error.request) {
          // console.error(error);
          throw error;
        }

        /** 설정 문제이거나 클라이언트 코드 문제임 */
        // console.error(error);
        throw error;
      }
    }
  }, [refreshToken]);

  // return { signIn, signOut };
  return { signIn, signOut, doRefreshToken };
};
