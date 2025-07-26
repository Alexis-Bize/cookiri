/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { type LazyDialogType } from './lazy-dialog.types';
import { safeAsync } from '@zeny/safe-async';
import { config } from './config';
import { Dialog } from '@cookiri-extension/components/ui/dialog';

//#region typings

type LazyDialogContextType = {
  dialogType: LazyDialogType | null;
  openDialog: (type: LazyDialogType) => void;
  closeDialog: () => void;
  DialogElement: React.ReactElement;
};

type Props = {
  children: ReactNode;
};

//#endregion
//#region context

const LazyDialogContext = createContext<LazyDialogContextType | void>(void 0);

//#endregion
//#region component

const LazyDialogProvider = ({ children }: Props) => {
  //#region states

  const [dialogType, setDialogType] = useState<LazyDialogType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [DialogContent, setDialogContent] = useState<React.ReactNode>(null);

  //#endregion
  //#region callbacks

  const setCurrentDialogType = useCallback((lazyDialogType: LazyDialogType) => {
    setDialogType(lazyDialogType);
  }, []);

  const closeCurrentDialog = useCallback(() => {
    setDialogType(null);
  }, []);

  const lazyLoadDialog = useCallback(async () => {
    if (isLoading === true || dialogType === null) {
      return;
    }

    setIsLoading(true);
    const [err, resp] = await safeAsync(config.lazyDialogs[dialogType]());
    setIsLoading(false);

    if (err !== null) {
      setDialogContent(null);
      console.error(err);
      return;
    }

    const Content = resp.default;
    setDialogContent(<Content />);
  }, [isLoading, dialogType]);

  //#endregion
  //#region effects

  useEffect(() => {
    if (dialogType !== null) lazyLoadDialog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogType]);

  useEffect(() => {
    if (dialogType === null && DialogContent !== null) {
      const timerId = setTimeout(() => {
        setDialogContent(null);
      }, 330);

      return () => clearTimeout(timerId);
    }
  }, [dialogType, DialogContent]);

  //#endregion
  //#region memos

  const DialogElement = useMemo(
    () => (
      <Dialog open={dialogType !== null} onOpenChange={closeCurrentDialog}>
        {DialogContent}
      </Dialog>
    ),
    [DialogContent, dialogType, closeCurrentDialog],
  );

  //#endregion
  //#region render

  return (
    <LazyDialogContext.Provider
      value={{ dialogType, openDialog: setCurrentDialogType, closeDialog: closeCurrentDialog, DialogElement }}>
      {children}
    </LazyDialogContext.Provider>
  );

  //#endregion
};

//#endregion

export { LazyDialogProvider, LazyDialogContext };
