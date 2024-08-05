import { Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { Link } from 'react-router-dom';

export function KakaoLoginButton() {
  const { VITE_KAKAO_API_KEY: apiKey, VITE_KAKAO_REDIRECT_URL: redirectURL } = import.meta.env;
  const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectURL}&response_type=code`;

  return (
    <Link to={kakaoLoginURL} replace>
      <Button variants="white" interactive="onlyScale" className="p-0">
        <Image src="/assets/kakao_login.png" className="h-[2.625rem] w-[20rem]" local />
      </Button>
    </Link>
  );
}
