import { ProfileDetails } from '@Components/ProfileDetails';
import { Button } from '@Components/ui/button';
import { useHeader } from '@Hooks/useHeader';
import { MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  const navigate = useNavigate();

  useHeader({
    title: '내 피드',
    leftSlot: () => (
      <Button variants="ghost" size="icon" onClick={() => navigate('/mypage', { replace: true })}>
        <MdChevronLeft className="size-6" />
      </Button>
    ),
  });

  return (
    <div className="flex h-full flex-col">
      <ProfileDetails viewType="owner" userId={0} />
    </div>
  );
}
