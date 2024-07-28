import cn from 'classnames';
import { forwardRef, InputHTMLAttributes } from 'react';
import { MdHighlightOff, MdOutlineCheckCircle } from 'react-icons/md';

export const Input = forwardRef<HTMLDivElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }: InputHTMLAttributes<HTMLInputElement>, ref) => {
  return (
    <div ref={ref} className={cn(className, 'peer flex flex-row rounded-lg border border-gray-200 px-5 py-[.875rem] focus-within:border-purple-500')}>
      <input className={'w-full appearance-none outline-none'} {...props} />
      {props['aria-invalid'] === false && props.value !== '' && <MdOutlineCheckCircle className="size-6 text-purple-500" />}
      {props['aria-invalid'] === true && <MdHighlightOff className="size-6 text-pink-600" />}
    </div>
  );
});
