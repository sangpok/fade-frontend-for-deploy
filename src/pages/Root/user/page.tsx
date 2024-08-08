import { ProfileDetails } from '@Components/ProfileDetails';
import { BackButton } from '@Components/ui/button';
import { useHeader } from '@Hooks/useHeader';
import { motion } from 'framer-motion';
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
    <motion.div initial={{ opacity: 0, scale: 0.9, transformOrigin: 'top' }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col">
      {isLocationUserState(state) && <ProfileDetails viewType="user" userId={state.userId} />}
      {!isLocationUserState(state) && <Navigate to="/" replace />}
    </motion.div>
  );
}
