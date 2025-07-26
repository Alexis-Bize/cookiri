/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { z } from 'zod';

//#region typings

export type CookieCreationData = z.infer<typeof cookieCreationSchema>;

//#endregion
//#region schemas

export const cookieCreationSchema = z
  .object({
    name: z.string().min(1, 'Cookie name cannot be empty'),
    value: z.string().default(''),
    domain: z.string().optional(),
    path: z.string().default('/'),
    secure: z.boolean().default(false),
    httpOnly: z.boolean().default(false),
    sameSite: z.enum(['no_restriction', 'lax', 'strict', 'unspecified']).default('no_restriction'),
    expirationDate: z.number().positive().optional(),
    storeId: z.string().min(1).default('default'),
  })
  .refine(data => data.domain === void 0 || data.domain.match(/^[a-zA-Z0-9.-]+$/) !== null, {
    message: 'Invalid domain format',
    path: ['domain'],
  })
  .refine(
    data => {
      const invalidChars = ' ()<>@,;:\\"/[]?={}';
      const hasInvalidChars = invalidChars.split('').some(char => data.name.includes(char) === true);
      const hasControlChars = data.name.split('').some(char => {
        const code = char.charCodeAt(0);
        return code <= 31 || code === 127;
      });

      return hasInvalidChars === false && hasControlChars === false;
    },
    { message: 'Invalid cookie name', path: ['name'] },
  )
  .refine(data => data.name.length <= 4096, {
    message: 'Cookie name cannot exceed 4096 characters',
    path: ['name'],
  })
  .refine(data => data.value.length <= 4096, {
    message: 'Cookie value cannot exceed 4096 characters',
    path: ['value'],
  })
  .refine(data => data.domain === void 0 || data.domain.length <= 253, {
    message: 'Cookie domain cannot exceed 253 characters',
    path: ['domain'],
  })
  .refine(data => data.path.length <= 4096, {
    message: 'Cookie path cannot exceed 4096 characters',
    path: ['path'],
  })
  .refine(
    data => {
      const totalSize = data.name.length + data.value.length + (data.domain?.length || 0) + data.path.length;
      return totalSize <= 4096;
    },
    { message: 'Total cookie size cannot exceed 4096 characters', path: ['totalSize'] },
  )
  .refine(data => data.path.startsWith('/') === true, { message: 'Cookie path must start with "/"', path: ['path'] });

//#endregion
//#region helpers

export const validateCookieCreation = (data: unknown): CookieCreationData => cookieCreationSchema.parse(data);
export const safeValidateCookieCreation = (data: unknown) => cookieCreationSchema.safeParse(data);

//#endregion
