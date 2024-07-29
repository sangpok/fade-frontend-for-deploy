import { FadeLogo } from '@Components/FadeLogo';
import { Link } from 'react-router-dom';
import { Carousel } from './components/Carousel';
import { KakaoLoginButton } from './components/KakaoLoginButton';

export default function Page() {
  return (
    <section className="flex h-dvh flex-col items-center justify-center">
      <div className="flex flex-[0.5] items-center">
        <FadeLogo />
      </div>

      <div className="flex w-full flex-[1.2] items-center justify-center">
        <Carousel />
      </div>

      <div className="flex flex-[0.8] items-center">
        <div className="flex flex-col gap-3">
          <KakaoLoginButton />
          <Link to="/auth/callback/kakao?code=test" className="rounded-lg border bg-gray-50 p-2 text-center">
            테스트 로그인(API 모킹용)
          </Link>
        </div>
      </div>
    </section>
  );
}
