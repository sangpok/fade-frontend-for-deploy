import { ProfileDetails } from '@Components/ProfileDetails';
import { BackButton } from '@Components/ui/button';
import { useHeader } from '@Hooks/useHeader';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

interface LocationUserState {
  userId: number;
}

function isLocationUserState(state: unknown): state is LocationUserState {
  return (state as LocationUserState).userId !== undefined;
}

export default function Page() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useHeader({ title: '계정 상세', leftSlot: () => <BackButton className="left-0" onClick={() => navigate(-1)} /> });

  return (
    <div className="flex h-full flex-col">
      {isLocationUserState(state) && <ProfileDetails viewType="user" userId={state.userId} />}
      {!isLocationUserState(state) && <Navigate to="/" replace />}
    </div>
  );
}
