import { ProfileDetails } from '@Components/ProfileDetails';
import { Button } from '@Components/ui/button';
import { useHeader } from '@Hooks/useHeader';
import { requestGetMyDetails } from '@Services/member';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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

  const { data } = useQuery({
    queryKey: ['user', 'me', 'detail'],
    queryFn: () => requestGetMyDetails(),
  });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, transformOrigin: 'top' }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col">
      {data && <ProfileDetails viewType="owner" userId={data.data.id} />}
    </motion.div>
  );
}
