import { Link } from 'react-router-dom';
import kakaoLoginImage from '@Assets/kakao_login.png';
import kakaoLogimImage2x from '@Assets/kakao_login@2x.png';

export function KakaoLoginButton() {
  const { VITE_KAKAO_API_KEY: apiKey, VITE_KAKAO_REDIRECT_URL: redirectURL } = import.meta.env;
  const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectURL}&response_type=code`;

  return (
    <Link
      style={{
        backgroundImage: `image-set(url('${kakaoLoginImage}') 1x, url('${kakaoLogimImage2x}') 2x)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
      to={kakaoLoginURL}
      className="h-[2.625rem] w-[20rem] rounded transition-transform touchdevice:active:scale-95 pointerdevice:hover:scale-105 pointerdevice:active:scale-95"
    />
  );
}
