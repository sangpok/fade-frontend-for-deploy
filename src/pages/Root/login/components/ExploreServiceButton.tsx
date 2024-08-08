import { Button } from '@Components/ui/button';
import { useModalActions } from '@Hooks/modal';
import { useState } from 'react';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { ExploreServiceModal } from './ExploreServiceModal';

const { VITE_KAKAO_API_KEY: apiKey, VITE_KAKAO_REDIRECT_URL: redirectURL } = import.meta.env;
const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectURL}&response_type=code`;

export function ExploreServiceButton() {
  const navigate = useNavigate();
  const { showModal } = useModalActions();

  const [isMockingPending, setIsMockingPending] = useState(false);

  const handleClick = async () => {
    const isMockingEnabled = await showModal<boolean>({ type: 'component', Component: ExploreServiceModal });

    // 취소
    if (isMockingEnabled == undefined) {
      return;
    }

    // 10초 로그인
    if (!isMockingEnabled) {
      location.replace(kakaoLoginURL);
      return;
    }

    setIsMockingPending(true);

    // MSW 작동
    const { worker } = await import('@/__mock__/instance');
    await worker.start({ onUnhandledRequest: 'bypass' });

    window.dispatchEvent(new CustomEvent('mockingStart'));
    document.querySelector('html')!.dataset.mockingEnabled = 'true';

    return navigate('/auth/callback/kakao?code=test', { replace: true });
  };

  return (
    <Button variants="outline" onClick={handleClick} disabled={isMockingPending}>
      {isMockingPending && <VscLoading className="mr-1 animate-spin" />}
      서비스 둘러보기
    </Button>
  );
}
