import { cn } from '@Utils/index';
import { PropsWithChildren } from 'react';

type ItemBadgeVariants = 'default' | 'primary';

interface TItemBadge {
  variants?: ItemBadgeVariants;
}

type ItemBadgeProps = PropsWithChildren<TItemBadge>;

export function ItemBadge({ variants = 'default', children }: ItemBadgeProps) {
  return (
    <div
      className={cn('min-w-fit rounded-2xl border px-5 py-[.625rem] transition-colors', {
        ['border-gray-200 bg-white']: variants === 'default',
        ['border-purple-100 bg-purple-50']: variants === 'primary',
      })}>
      {children}
    </div>
  );
}
