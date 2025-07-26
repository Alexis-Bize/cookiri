/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { safeAsync } from '@zeny/safe-async';

//#region typings

export type ExecuteOperationPayload = { id: string } & (
  | { operation: 'edit'; data: chrome.cookies.Cookie; originalData: chrome.cookies.Cookie }
  | { operation: 'create'; data: chrome.cookies.Cookie; originalData?: never }
  | { operation: 'delete'; data?: never; originalData: chrome.cookies.Cookie }
);

//#endregion
//#region public methods

export const executeBatchCookiesOperations = async (
  payloads: ExecuteOperationPayload[],
): Promise<{ success: string[]; failed: string[] }> => {
  const results: { success: string[]; failed: string[] } = { success: [], failed: [] };

  for (const payload of payloads) {
    const success = await executeCookieOperation(payload);

    if (success === true) {
      results.success.push(payload.id);
    } else results.failed.push(payload.id);
  }

  return results;
};

export const executeCookieOperation = async (payload: ExecuteOperationPayload): Promise<boolean> => {
  const { data, originalData, operation } = payload;

  if (operation === 'create') {
    const [createErr, createSuccess] = await safeAsync(createCookie(data));
    if (createErr !== null) {
      console.error(createErr);
      return false;
    }

    return createSuccess === true;
  }

  // Rollback strategy
  const clone = { ...originalData };

  const [deleteErr, deleteSuccess] = await safeAsync(deleteCookie(originalData));
  if (deleteErr !== null) {
    console.error(deleteErr);
    return false;
  }

  if (operation === 'delete') {
    return deleteSuccess === true;
  }

  const cookieDomain = data.domain.trim() || clone.domain || '';
  const [createErr, createSuccess] = await safeAsync(
    createCookie({
      ...data,
      name: data.name.trim() || clone.name,
      path: data.path.trim() || clone.path,
      domain: data.domain.trim() || clone.domain,
      hostOnly: cookieDomain.startsWith('.') === false,
    }),
  );

  if (createErr !== null) {
    console.error(createErr);

    // Rollback
    const [rollbackErr] = await safeAsync(createCookie(clone));
    if (rollbackErr !== null) {
      // Well... This is bad.
      console.error(rollbackErr);
    }

    return false;
  }

  return createSuccess === true;
};

//#endregion
//#region private methods

const deleteCookie = async (cookie: chrome.cookies.Cookie): Promise<boolean> => {
  const removeDetails: chrome.cookies.CookieDetails = {
    url: formatCookieUrl(cookie),
    name: cookie.name,
    storeId: cookie.storeId ?? void 0,
  };

  const resp = await chrome.cookies.remove(removeDetails);
  return resp !== null;
};

const createCookie = async (cookie: chrome.cookies.Cookie): Promise<boolean> => {
  const createDetails: chrome.cookies.SetDetails = {
    url: formatCookieUrl(cookie),
    name: cookie.name.trim(),
    value: cookie.value,
    secure: cookie.secure === true,
    httpOnly: cookie.httpOnly === true,
    storeId: cookie.storeId ?? void 0,
    sameSite: cookie.sameSite,
    path: cookie.path,
  };

  if (cookie.hostOnly !== true) {
    createDetails.domain = cookie.domain;
  }

  if (cookie.session === true || cookie.expirationDate === void 0) {
    createDetails.expirationDate = void 0;
  } else if (typeof cookie.expirationDate === 'number' && cookie.expirationDate > Date.now() / 1000) {
    createDetails.expirationDate = cookie.expirationDate;
  } else createDetails.expirationDate = void 0;

  const resp = await chrome.cookies.set(createDetails);
  return resp !== null;
};

const formatCookieUrl = (cookie: chrome.cookies.Cookie) => {
  const hostname = cookie.domain.startsWith('.') === true ? cookie.domain.slice(1) : cookie.domain;
  const isLocalhost = hostname === 'localhost' || hostname.endsWith('.localhost') === true;
  const protocol = isLocalhost === true || cookie.secure !== true ? 'http://' : 'https://';
  return `${protocol}${hostname}${cookie.path || '/'}`;
};

//#endregion
