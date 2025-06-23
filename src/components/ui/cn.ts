// src/utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for deduplication
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Alternative className merger without tailwind-merge dependency
 * Use this if you don't want to install tailwind-merge
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Conditional class utility
 * Usage: conditionalClass('base-class', condition, 'conditional-class')
 */
export function conditionalClass(
  baseClass: string,
  condition: boolean,
  conditionalClass: string
): string {
  return cn(baseClass, condition && conditionalClass);
}

/**
 * Variant class utility for component variants
 * Usage: variantClass('button', { variant: 'primary', size: 'lg' }, variants)
 */
export function variantClass<T extends Record<string, any>>(
  base: string,
  props: T,
  variants: Record<keyof T, Record<string, string>>
): string {
  const variantClasses = Object.entries(props)
    .map(([key, value]) => variants[key]?.[value])
    .filter(Boolean);
  
  return cn(base, ...variantClasses);
}

/**
 * Focus ring utility for consistent focus styles
 */
export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

/**
 * Common transition utility
 */
export const transition = 'transition-all duration-200 ease-in-out';

/**
 * Screen reader only utility
 */
export const srOnly = 'sr-only';

/**
 * Truncate text utility
 */
export const truncate = 'truncate';

/**
 * Responsive utilities
 */
export const responsive = {
  hideOnMobile: 'hidden md:block',
  hideOnDesktop: 'block md:hidden',
  mobileOnly: 'md:hidden',
  desktopOnly: 'hidden md:block',
  tabletAndUp: 'hidden sm:block',
  mobileAndTablet: 'lg:hidden'
};

/**
 * Common spacing utilities
 */
export const spacing = {
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-6',
  xl: 'space-y-8'
};

/**
 * Common shadow utilities
 */
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  inner: 'shadow-inner'
};

/**
 * Common border radius utilities
 */
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
};

/**
 * Animation utilities
 */
export const animations = {
  spin: 'animate-spin',
  ping: 'animate-ping',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  scaleIn: 'animate-scale-in'
};

/**
 * Layout utilities
 */
export const layout = {
  container: 'container mx-auto px-4',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  gridCols: {
    1: 'grid grid-cols-1',
    2: 'grid grid-cols-1 md:grid-cols-2',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }
};

/**
 * Text utilities
 */
export const text = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-gray-600 dark:text-gray-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  muted: 'text-gray-500 dark:text-gray-400'
};

/**
 * Background utilities
 */
export const backgrounds = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-600 text-white',
  error: 'bg-red-600 text-white',
  light: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
  dark: 'bg-gray-900 text-gray-100'
};

/**
 * Component size variants
 */
export const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

/**
 * Common form utilities
 */
export const form = {
  input: 'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
  inputError: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  label: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
  labelError: 'text-red-700 dark:text-red-400',
  error: 'text-sm text-red-600 dark:text-red-400',
  helper: 'text-sm text-gray-500 dark:text-gray-400'
};

/**
 * Loading state utilities
 */
export const loading = {
  spinner: 'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
  skeleton: 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
  overlay: 'absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center'
};

/**
 * Status color utilities
 */
export const status = {
  active: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900',
  inactive: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
  pending: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900',
  completed: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900',
  error: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
};