import { useAuthActions } from '@Hooks/auth';
import { clearAuthorizationHeader } from '@Libs/axios';
import { requestSignOut } from '@Services/auth';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export async function loader() {
  return await requestSignOut();
}

export default function SignOut() {
  const { signOut } = useAuthActions();

  useEffect(() => {
    signOut();
    clearAuthorizationHeader();
  }, []);

  return <Navigate to="/" replace />;
}
