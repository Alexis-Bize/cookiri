/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { use } from 'react';
import { CookieEditorContext } from '../cookie-editor';

//#region hook

const useCookieEditor = () => {
  const context = use(CookieEditorContext);
  if (context === void 0) {
    throw new Error('useCookieEditor must be used within a CookieEditorProvider');
  }

  return context;
};

//#endregion

export { useCookieEditor };
