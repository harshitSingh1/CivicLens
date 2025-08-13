// src/components/Button.tsx
import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'default' | 'lg';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:opacity-50 disabled:pointer-events-none',
          variant === 'default' && 'bg-blue-600 text-white hover:bg-blue-700',
          variant === 'outline' && 'border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800',
          variant === 'ghost' && 'hover:bg-gray-100 dark:hover:bg-gray-800',
          size === 'xs' && 'h-7 px-2 text-xs',
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'default' && 'h-10 px-4 py-2',
          size === 'lg' && 'h-11 px-8 text-lg',
          className
        )}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;