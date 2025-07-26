/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatDateTimeLocal = (ts?: number): string => {
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!ts) {
    const d = new Date(ts * 1000);
    return format(d, "yyyy-MM-dd'T'HH:mm");
  } else return '';
};

export const sleep = (ts: number) => new Promise(resolve => setTimeout(resolve, ts));
