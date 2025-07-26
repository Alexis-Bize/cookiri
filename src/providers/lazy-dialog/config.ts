/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import type { LazyDialogType } from './lazy-dialog.types';

//#region typings

type LazyDialogLoadObject = Record<LazyDialogType, () => Promise<{ default: unknown }>>;

//#endregion
//#region config

const lazyDialogs = {
  'create-cookie': () => import('./partials/create-cookie'),
} as const satisfies LazyDialogLoadObject;

const config = {
  lazyDialogs,
} as const;

//#endregion

export { config };
