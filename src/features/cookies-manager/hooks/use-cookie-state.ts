/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useReducer, useMemo, useEffect } from 'react';
import { useCookieEditor } from '@cookiri-extension/providers/hooks/use-cookie-editor';
import { createCookieId } from '@cookiri-extension/features/cookies-manager/modules/utilities/cookies/helpers';
import { useDomainCookies } from '@cookiri-extension/providers/hooks/use-domain-cookies';

//#region typings

type CookieState = chrome.cookies.Cookie & {
  hasError: boolean;
  toBeDeleted: boolean;
};

type CookieAction =
  | { type: 'SET_NAME'; payload: chrome.cookies.Cookie['name'] }
  | { type: 'SET_VALUE'; payload: chrome.cookies.Cookie['value'] }
  | { type: 'SET_DOMAIN'; payload: chrome.cookies.Cookie['domain'] }
  | { type: 'SET_PATH'; payload: chrome.cookies.Cookie['path'] }
  | { type: 'SET_HTTP_ONLY'; payload: chrome.cookies.Cookie['httpOnly'] }
  | { type: 'SET_SECURE'; payload: chrome.cookies.Cookie['secure'] }
  | { type: 'SET_SESSION'; payload: chrome.cookies.Cookie['session'] }
  | { type: 'SET_EXPIRATION_DATE'; payload: chrome.cookies.Cookie['expirationDate'] }
  | { type: 'SET_SAME_SITE'; payload: chrome.cookies.Cookie['sameSite'] }
  | { type: 'SET_HOST_ONLY'; payload: chrome.cookies.Cookie['hostOnly'] }
  | { type: 'FLAG_AS_ERRORED'; payload: boolean }
  | { type: 'MARK_FOR_DELETION'; payload: boolean }
  | { type: 'RESET'; payload: chrome.cookies.Cookie };

//#endregion
//#region reducer

const cookieReducer = (state: CookieState, action: CookieAction): CookieState => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_VALUE':
      return { ...state, value: action.payload };
    case 'SET_DOMAIN':
      return { ...state, domain: action.payload };
    case 'SET_PATH':
      return { ...state, path: action.payload };
    case 'SET_HTTP_ONLY':
      return { ...state, httpOnly: action.payload };
    case 'SET_SECURE':
      return {
        ...state,
        secure: action.payload,
        sameSite: state.sameSite === 'no_restriction' && action.payload === false ? 'unspecified' : state.sameSite,
      };
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    case 'SET_EXPIRATION_DATE':
      return { ...state, expirationDate: action.payload };
    case 'SET_SAME_SITE':
      return {
        ...state,
        sameSite: action.payload === 'no_restriction' && state.secure !== true ? 'unspecified' : action.payload,
      };
    case 'SET_HOST_ONLY':
      return { ...state, hostOnly: action.payload };
    case 'MARK_FOR_DELETION':
      return { ...state, toBeDeleted: action.payload };
    case 'FLAG_AS_ERRORED':
      return { ...state, hasError: action.payload };
    case 'RESET':
      return { ...action.payload, hasError: false, toBeDeleted: false };
    default:
      return state;
  }
};

//#endregion
//#region hook

const useCookieState = (cookie: chrome.cookies.Cookie, createMode = false) => {
  //#region hooks

  const { data } = useDomainCookies();
  const { addPendingChange, removePendingChange, registerResetFunction, unregisterResetFunction } = useCookieEditor();

  //#endregion
  //#region reducers

  const [state, dispatch] = useReducer(cookieReducer, {
    ...cookie,
    hasError: false,
    toBeDeleted: false,
  });

  //#endregion
  //#region memos

  const isModified = useMemo(
    () =>
      createMode === false &&
      (state.name !== cookie.name ||
        state.value !== cookie.value ||
        state.domain !== cookie.domain ||
        state.path !== cookie.path ||
        state.httpOnly !== cookie.httpOnly ||
        state.secure !== cookie.secure ||
        state.session !== cookie.session ||
        state.expirationDate !== cookie.expirationDate ||
        state.sameSite !== cookie.sameSite ||
        state.hostOnly !== cookie.hostOnly),
    [createMode, state, cookie],
  );

  const cookieId = useMemo(() => {
    return createCookieId(cookie);
  }, [cookie]);

  const resetInitialValues = useMemo(() => {
    return () => dispatch({ type: 'RESET', payload: cookie });
  }, [cookie]);

  const actions = useMemo(
    () => ({
      setName: (value: string) => dispatch({ type: 'SET_NAME', payload: value }),
      setValue: (value: string) => dispatch({ type: 'SET_VALUE', payload: value }),
      setDomain: (domain: string) => dispatch({ type: 'SET_DOMAIN', payload: domain }),
      setPath: (path: string) => dispatch({ type: 'SET_PATH', payload: path }),
      setHttpOnly: (httpOnly: boolean) => dispatch({ type: 'SET_HTTP_ONLY', payload: httpOnly }),
      setSecure: (secure: boolean) => dispatch({ type: 'SET_SECURE', payload: secure }),
      setSession: (session: boolean) => dispatch({ type: 'SET_SESSION', payload: session }),
      setExpirationDate: (expirationDate?: number) =>
        dispatch({ type: 'SET_EXPIRATION_DATE', payload: expirationDate }),
      setSameSite: (sameSite: chrome.cookies.SameSiteStatus) => dispatch({ type: 'SET_SAME_SITE', payload: sameSite }),
      setHostOnly: (hostOnly: boolean) => dispatch({ type: 'SET_HOST_ONLY', payload: hostOnly }),
      markForDeletion: (toBeDeleted: boolean) => dispatch({ type: 'MARK_FOR_DELETION', payload: toBeDeleted }),
      flagAsErrored: (hasError: boolean) => dispatch({ type: 'FLAG_AS_ERRORED', payload: hasError }),
      resetInitialValues,
    }),
    [dispatch, resetInitialValues],
  );

  //#endregion
  //#region effects

  useEffect(() => {
    registerResetFunction(cookieId, resetInitialValues);
    return () => unregisterResetFunction(cookieId);
  }, [cookieId, resetInitialValues, registerResetFunction, unregisterResetFunction]);

  useEffect(() => {
    if (data === void 0 || data.domain === null) {
      return;
    }

    const clone = { ...state };
    if (clone.domain.length === 0) {
      clone.domain = data.domain;
    }

    if (createMode === true) {
      if (state.hasError === false) {
        addPendingChange({ id: cookieId, operation: 'create', data: clone });
      } else removePendingChange(cookieId);

      return;
    }

    if (state.toBeDeleted === true && state.hasError === false) {
      addPendingChange({ id: cookieId, operation: 'delete', originalData: cookie });
    } else if (isModified === true && state.hasError === false) {
      addPendingChange({ id: cookieId, operation: 'edit', originalData: cookie, data: clone });
    } else removePendingChange(cookieId);
  }, [data, createMode, isModified, cookieId, cookie, state, addPendingChange, removePendingChange, state.toBeDeleted]);

  //#endregion
  //#region return

  return { state, cookieId, cookie, actions, isModified };

  //#endregion
};

//#endregion

export { useCookieState };
