import fadeLogoImage from '@Assets/fade_logo.png';

export function FadeLogo() {
  return <div className="h-8 w-[7.125rem]" style={{ backgroundImage: `url('${fadeLogoImage}')` }} />;
}
