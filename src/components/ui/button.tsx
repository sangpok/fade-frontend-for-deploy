import { cn } from '@Utils/index';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { MdChevronLeft } from 'react-icons/md';

type ButtonVariant = 'primary' | 'secondary' | 'white' | 'destructive' | 'ghost' | 'outline';
type ButtonSize = 'default' | 'icon';
type ButtonInteractive = 'default' | 'onlyScale' | 'onlyColor';

interface ButtonProps {
  variants?: ButtonVariant;
  size?: ButtonSize;
  interactive?: ButtonInteractive;
}

/** TODO: button 요소 자체가 disabled 될 땐 조건부 interactive가 안 먹힘 ref로 감시해야 하나?  */

export function Button({
  variants = 'primary',
  size = 'default',
  interactive = 'default',
  className,
  children,
  ...props
}: PropsWithChildren<ButtonProps> & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'group flex items-center justify-center rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400',
        {
          ['bg-purple-500 text-white']: variants === 'primary',
          ['bg-black text-white']: variants === 'secondary',
          ['bg-white text-gray-900']: variants === 'white',
          ['bg-pink-400 text-white']: variants === 'destructive',
          [`disabled:bg-transparent`]: variants === 'ghost',
          [`border border-gray-200`]: variants === 'outline',
        },
        {
          [`aria-[disabled='false']:touchdevice:active:bg-gray-100 aria-[disabled='false']:pointerdevice:hover:bg-gray-100`]:
            ['white', 'ghost', 'outline'].includes(variants) && (interactive === 'default' || interactive === 'onlyColor'),
        },
        {
          ['p-[.625rem]']: size === 'default',
          ['p-2']: size === 'icon',
        },
        className
      )}
      aria-disabled={props.disabled || false}
      {...props}>
      <span
        className={cn('inline-block transition-transform', {
          [`group-aria-[disabled='false']:touchdevice:group-active:scale-90 group-aria-[disabled='false']:pointerdevice:group-active:scale-90`]:
            interactive === 'default' || interactive === 'onlyScale',
        })}>
        {children}
      </span>
    </button>
  );
}

/** TODO: 서브 페이지일 때의 위치도 넣기 */
export function BackButton({ className, onClick }: { className?: string; onClick: () => void }) {
  return (
    <Button variants="ghost" size="icon" className={cn('absolute left-3 top-1/2 -translate-y-1/2', className)} onClick={onClick}>
      <MdChevronLeft className="size-6" />
    </Button>
  );
}
