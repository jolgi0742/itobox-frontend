// src/utils/cn.ts

/**
 * Simple utility function to merge Tailwind CSS classes
 * Works without external dependencies
 */
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ') // Remove multiple spaces
    .trim();
}

// Alternative if you want to use with clsx (optional)
// export { clsx as cn } from 'clsx';

export default cn;