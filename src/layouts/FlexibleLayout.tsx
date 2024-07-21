import { cn } from '@Utils/index';
import { forwardRef, HTMLAttributes, PropsWithChildren } from 'react';

const Root = forwardRef<HTMLDivElement, PropsWithChildren<HTMLAttributes<HTMLDivElement>>>(
  ({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>, ref) => {
    return (
      <div ref={ref} className={cn('flex h-full flex-col', className)} {...props}>
        {children}
      </div>
    );
  }
);

function Header({ children }: PropsWithChildren) {
  return <>{children}</>;
}

function Content({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <section className={cn('min-h-1 flex-1 overflow-y-scroll border border-blue-300 p-5', className)} {...props}>
      {children}
    </section>
  );
}

function Footer({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export const FlexibleLayout = { Root, Header, Content, Footer };
