/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createContext, useRef, useState, useMemo, useCallback, type ReactNode } from 'react';
import { createCookieId } from '@cookiri-extension/features/cookies-manager/modules/utilities/cookies/helpers';
import { useDomainCookies } from '@cookiri-extension/providers/hooks/use-domain-cookies';
import { safeAsync } from '@zeny/safe-async';

import {
  executeBatchCookiesOperations,
  type ExecuteOperationPayload,
} from '@cookiri-extension/features/cookies-manager/modules/utilities/cookies/manage';

//#region typings

type ResetFunction = () => void;

type CookieEditorContextType = {
  hasPendingUpdates: boolean;
  addPendingChange: (change: ExecuteOperationPayload) => void;
  removePendingChange: (cookieId: string) => void;
  discardChange: (cookieId: string) => void;
  discardAllChanges: () => void;
  saveChange: (cookieId: string) => Promise<void>;
  saveAllChanges: () => Promise<void>;
  registerResetFunction: (cookieId: string, resetFn: ResetFunction) => void;
  unregisterResetFunction: (cookieId: string) => void;
  deleteAllCookies: () => Promise<void>;
};

type Props = {
  children: ReactNode;
};

//#endregion
//#region context

const CookieEditorContext = createContext<CookieEditorContextType | void>(void 0);

//#endregion
//#region provider

const CookieEditorProvider = ({ children }: Props) => {
  //#region hooks

  const { data, refetch } = useDomainCookies();

  //#endregion
  //#region states

  const [pendingChanges, setPendingChanges] = useState<ExecuteOperationPayload[]>([]);

  //#endregion
  //#region references

  const resetFunctionsRef = useRef<Map<string, ResetFunction>>(new Map());

  //#endregion
  //#region memos

  const hasPendingUpdates = useMemo(
    () => pendingChanges.filter(curr => curr.operation !== 'create').length !== 0,
    [pendingChanges],
  );

  //#endregion
  //#region callbacks

  const registerResetFunction = useCallback((cookieId: string, resetFn: ResetFunction) => {
    resetFunctionsRef.current.set(cookieId, resetFn);
  }, []);

  const unregisterResetFunction = useCallback((cookieId: string) => {
    resetFunctionsRef.current.delete(cookieId);
  }, []);

  const addPendingChange = useCallback((change: ExecuteOperationPayload) => {
    setPendingChanges(prev => {
      const filtered = prev.filter(c => c.id !== change.id);
      return [...filtered, change];
    });
  }, []);

  const removePendingChange = useCallback((cookieId: string) => {
    setPendingChanges(prev => prev.filter(c => c.id !== cookieId));
  }, []);

  const clearChange = useCallback(
    (cookieId: string) => {
      unregisterResetFunction(cookieId);
      removePendingChange(cookieId);
    },
    [removePendingChange, unregisterResetFunction],
  );

  const clearAllChanges = useCallback(() => {
    pendingChanges.forEach(change => {
      unregisterResetFunction(change.id);
    });

    setPendingChanges([]);
  }, [pendingChanges, unregisterResetFunction]);

  const discardChange = useCallback(
    (cookieId: string) => {
      resetFunctionsRef.current.get(cookieId)?.();
      removePendingChange(cookieId);
    },
    [removePendingChange],
  );

  const discardAllChanges = useCallback(() => {
    pendingChanges.forEach(change => {
      resetFunctionsRef.current.get(change.id)?.();
    });

    setPendingChanges([]);
  }, [pendingChanges]);

  const saveChange = useCallback(
    async (cookieId: string) => {
      const pendingChange = pendingChanges.find(c => c.id === cookieId);
      if (pendingChange === void 0) {
        return;
      }

      const [err, resp] = await safeAsync(executeBatchCookiesOperations([pendingChange]));
      if (err !== null) {
        console.error(err);
      } else console.debug(resp);

      clearChange(cookieId);
      await refetch();
    },
    [pendingChanges, clearChange, refetch],
  );

  const saveAllChanges = useCallback(async () => {
    if (pendingChanges.length === 0) {
      return;
    }

    const [err, resp] = await safeAsync(executeBatchCookiesOperations(pendingChanges));
    if (err !== null) {
      console.error(err);
    } else console.debug(resp);

    clearAllChanges();
    await refetch();
  }, [pendingChanges, clearAllChanges, refetch]);

  const deleteAllCookies = useCallback(async () => {
    discardAllChanges();

    const [err, resp] = await safeAsync(
      executeBatchCookiesOperations(
        (data?.cookies || []).map(cookie => ({
          id: createCookieId(cookie),
          originalData: cookie,
          operation: 'delete',
        })),
      ),
    );

    if (err !== null) {
      console.error(err);
    } else console.debug(resp);

    await refetch();
  }, [data?.cookies, discardAllChanges, refetch]);

  //#endregion
  //#region render

  return (
    <CookieEditorContext.Provider
      value={{
        hasPendingUpdates,
        addPendingChange,
        removePendingChange,
        discardChange,
        discardAllChanges,
        saveChange,
        saveAllChanges,
        registerResetFunction,
        unregisterResetFunction,
        deleteAllCookies,
      }}>
      {children}
    </CookieEditorContext.Provider>
  );

  //#endregion
};

//#endregion

export { CookieEditorProvider, CookieEditorContext };
