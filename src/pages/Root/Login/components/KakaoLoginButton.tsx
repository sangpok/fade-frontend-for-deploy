import { Link } from 'react-router-dom';
import kakaoLoginImage from '@Assets/kakao_login.png';

export function KakaoLoginButton() {
  const { VITE_KAKAO_API_KEY: apiKey, VITE_KAKAO_REDIRECT_URL: redirectURL } = import.meta.env;
  const kakaoLoginURL = `https://kauth.kakao.com/oauth/authorize?client_id=${apiKey}&redirect_uri=${redirectURL}&response_type=code`;

  return (
    <Link to={kakaoLoginURL}>
      <div className={`h-[2.8125rem] w-[18.75rem] rounded bg-gray-100`} style={{ backgroundImage: `url('${kakaoLoginImage}')` }} />
    </Link>
  );
}
