import { cn } from '@Utils/index';
import { Image } from './image';

interface AvatarProps {
  src: string | undefined;
  size: '32' | '40' | '72' | '124';
}

export function Avatar({ src, size }: AvatarProps) {
  return (
    <div
      className={cn('overflow-hidden rounded-lg bg-gray-200', {
        ['size-[2rem]']: size === '32',
        ['size-[2.5rem]']: size === '40',
        ['size-[4.5rem]']: size === '72',
        ['size-[7.75rem]']: size === '124',
      })}>
      {src && <Image src={src} />}
    </div>
  );
}
