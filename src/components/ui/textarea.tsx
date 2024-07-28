import { cn } from '@Utils/index';
import { TextareaHTMLAttributes } from 'react';

interface TTextarea {
  onChange: (value: string) => void;
}

type TextareaProps = TTextarea & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>;

export function Textarea({ className, onChange, ...props }: TextareaProps) {
  const textLength = props.value?.toString().length || 0;
  const { maxLength } = props;

  const hasMaxLength = maxLength !== undefined || maxLength !== 0;

  return (
    <div className="flex h-full w-full resize-none flex-col rounded-lg bg-gray-100 p-3 transition-colors aria-disabled:bg-gray-300" aria-disabled={props.disabled}>
      <textarea
        className={cn('h-full w-full resize-none bg-transparent align-text-top outline-none transition-colors disabled:bg-gray-300 disabled:text-gray-500', className)}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {hasMaxLength && (
        <p className="text-right text-xs text-gray-400">
          {textLength > maxLength! ? maxLength : textLength} / {maxLength}
        </p>
      )}
    </div>
  );
}
