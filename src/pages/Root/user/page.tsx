import { BackButton } from '@Components/ui/button';
import { ProfileDetails } from '@Components/ProfileDetails';
import { useHeader } from '@Hooks/useHeader';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  const navigate = useNavigate();
  useHeader({ title: '계정 상세', leftSlot: () => <BackButton className="left-0" onClick={() => navigate(-1)} /> });

  return (
    <div className="flex h-full flex-col">
      <ProfileDetails viewType="user" userId={0} />
    </div>
  );
}
