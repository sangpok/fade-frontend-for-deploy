import fadeLogoImage from '@Assets/fade_logo.png';
import { Image } from './ui/image';

export function FadeLogo() {
  return <Image src={fadeLogoImage} className="h-8 w-[7.125rem]" />;
}
