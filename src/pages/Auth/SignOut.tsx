import { useAuthActions } from '@Hooks/auth';
import { clearAuthorizationHeader } from '@Libs/axios';
import { queryClient } from '@Libs/queryclient';
import { requestSignOut } from '@Services/auth';
import { useAuthStore } from '@Stores/auth';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export async function loader() {
  return await requestSignOut();
}

export default function SignOut() {
  const { signOut } = useAuthActions();
  const resetAuth = useAuthStore((state) => state.resetAuth);

  useEffect(() => {
    signOut();
    clearAuthorizationHeader();
    queryClient.invalidateQueries({ refetchType: 'all' });
    resetAuth();
  }, []);

  return <Navigate to="/" replace />;
}
