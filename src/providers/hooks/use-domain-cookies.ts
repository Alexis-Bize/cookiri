/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { use } from 'react';
import { DomainCookiesContext } from '../domain-cookies';

//#region hook

const useDomainCookies = () => {
  const context = use(DomainCookiesContext);
  if (context === void 0) {
    throw new Error('useDomainCookies must be used within a DomainCookiesProvider');
  }

  return context;
};

//#endregion

export { useDomainCookies };
