import { useAuthActions } from '@Hooks/auth';
import { requestSignOut } from '@Services/authAPI';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export async function loader() {
  return await requestSignOut();
}

export default function SignOut() {
  const { signOut } = useAuthActions();

  useEffect(() => {
    signOut();
  }, []);

  return <Navigate to="/" replace />;
}
