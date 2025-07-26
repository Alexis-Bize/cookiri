/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-secondary text-sm font-medium transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:grayscale disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 not-disabled:cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/80 border border-transparent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-secondary',

        ['outline-destructive']:
          'border border-destructive bg-transparent text-destructive-foreground hover:border-destructive/80 hover:bg-destructive/5',
        ['outline-primary']:
          'text-primary shadow-xs bg-transparent hover:bg-primary/5 border border-primary hover:border-primary/80',
        ['outline-secondary']:
          'border border-secondary bg-transparent text-secondary hover:border-secondary/80 hover:bg-secondary/5 disabled:opacity-40',
        ['outline-solid']: 'border border-input bg-transparent hover:border-primary hover:text-primary',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'link px-0! transition-colors',
      },
      size: {
        default: 'px-4 py-2 text-sm h-8 [&_svg]:size-3.5',
        sm: 'h-7 px-4 text-xs [&_svg]:size-3.5',
        xs: 'h-6 px-3 text-xs [&_svg]:size-2.5',
        lg: 'px-8 h-11 text-lg',
        icon: 'aspect-square size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export { buttonVariants };
