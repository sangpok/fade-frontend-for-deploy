import { FadeLogo } from '@Components/FadeLogo';
import { Carousel } from './components/Carousel';
import { ExploreServiceButton } from './components/ExploreServiceButton';
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
          <ExploreServiceButton />
        </div>
      </div>
    </section>
  );
}
