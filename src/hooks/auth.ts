import { useAuthStore } from '@Stores/auth';
import { AuthTokens } from '@Types/User';
import { useCallback, useMemo } from 'react';

export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useCsrfToken = () => useAuthStore((state) => state.csrfToken);

export const useIsAuthenticated = () => {
  const user = useUser();

  return useMemo(() => !!user, [user]);
};

export const useAuthActions = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const setAuthFromToken = useAuthStore((state) => state.setAuthFromToken);
  const resetAuth = useAuthStore((state) => state.resetAuth);

  const signIn = useCallback(
    ({ accessToken, csrfToken }: AuthTokens) => {
      setTokens({ accessToken, csrfToken });
      setAuthFromToken({ accessToken });
    },
    [setTokens, setAuthFromToken]
  );

  const signOut = useCallback(() => {
    resetAuth();
  }, [resetAuth]);

  return { signIn, signOut };
};
