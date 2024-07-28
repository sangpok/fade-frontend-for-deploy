import { cn } from '@Utils/index';
import { PropsWithChildren } from 'react';

interface GridProps {
  cols: 3 | 5;
  id?: string;
  className?: string;
}

export function Grid({ cols, className, id, children }: PropsWithChildren<GridProps>) {
  return (
    <div
      id={id}
      className={cn(
        'grid w-full',
        {
          ['grid-cols-3 gap-1']: cols === 3,
          ['grid-cols-5 gap-2']: cols === 5,
        },
        className
      )}>
      {children}
    </div>
  );
}
