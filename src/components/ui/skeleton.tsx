import { cn } from '@Utils/index';
import { HTMLAttributes } from 'react';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('animate-pulse overflow-hidden rounded-lg bg-gray-200', className)} {...props} />;
}
