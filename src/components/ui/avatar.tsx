import { cn } from '@Utils/index';
import { Image } from './image';

const profileDefaultImage1 = '/assets/default_pfp_{SIZE}_1.jpg';
const profileDefaultImage2 = '/assets/default_pfp_{SIZE}_2.jpg';
const profileDefaultImage3 = '/assets/default_pfp_{SIZE}_3.jpg';
const profileDefaultImage4 = '/assets/default_pfp_{SIZE}_4.jpg';

const defaultProfileImages = [profileDefaultImage1, profileDefaultImage2, profileDefaultImage3, profileDefaultImage4];

interface AvatarProps {
  src: string | undefined;
  size: '32' | '40' | '72' | '124';
  local?: boolean;
}

export function Avatar({ src, size, local = false }: AvatarProps) {
  return (
    <div
      className={cn('overflow-hidden rounded-lg bg-gray-200', {
        ['size-[2rem]']: size === '32',
        ['size-[2.5rem]']: size === '40',
        ['size-[4.5rem]']: size === '72',
        ['size-[7.75rem]']: size === '124',
      })}>
      {!src && <Image src={defaultProfileImages.at(Math.floor(Math.random() * 4))!.replace('{SIZE}', size)} local={true} />}
      {src && <Image src={src} local={local} />}
    </div>
  );
}
