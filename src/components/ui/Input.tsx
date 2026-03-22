import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg',
          'text-[var(--text-primary)] placeholder-[var(--text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent',
          'transition-all duration-150',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
