/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CookieForm } from '../../../features/cookies-manager/components/form';
import { Button } from '@cookiri-extension/components/ui/button';
import { useCookieState } from '../../../features/cookies-manager/hooks/use-cookie-state';
import { useCookieEditor } from '@cookiri-extension/providers/hooks/use-cookie-editor';
import { safeAsync } from '@zeny/safe-async';
import { useEffect, useState } from 'react';
import { CheckIcon, RotateCcwIcon, XIcon } from 'lucide-react';
import { cn } from '@cookiri-extension/shared/modules/utilities';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cookiri-extension/components/ui/dialog';
import { useLazyDialog } from '@cookiri-extension/providers/hooks/use-lazy-dialog';

//#region declarations

const TEMPLATE_COOKIE = {
  domain: '',
  name: 'new-cookie',
  value: '',
  path: '/',
  storeId: '',
  session: true,
  httpOnly: false,
  hostOnly: true,
  secure: true,
  sameSite: 'unspecified',
} satisfies chrome.cookies.Cookie;

//#endregion
//#region component

const CreateCookieDialog = () => {
  //#region hooks

  const cookieStateProps = useCookieState(TEMPLATE_COOKIE, true);
  const { closeDialog } = useLazyDialog();
  const { state, cookieId } = cookieStateProps;
  const { discardChange, saveChange } = useCookieEditor();

  //#endregion
  //#region states

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [displayActions, setDisplayActions] = useState<boolean>(false);

  //#endregion
  //#region effects

  useEffect(() => {
    setDisplayActions(!state.hasError);
    return () => discardChange(cookieId);
  }, [discardChange, cookieId, state.hasError]);

  //#endregion
  //#region handlers

  const handleCreate = async () => {
    if (isLoading === true) {
      return;
    }

    setIsLoading(true);
    const [err] = await safeAsync(saveChange(cookieId));
    setIsLoading(false);

    if (err !== null) {
      console.error(err);
    } else closeDialog();
  };

  //#endregion
  //#region render

  return (
    <DialogContent
      showCloseButton={false}
      className="bg-background/95 flex flex-col justify-between p-0 backdrop-blur-xs">
      <div className="relative">
        <DialogHeader className="flex flex-row items-center justify-between gap-2.5 border-b p-2.5">
          <DialogTitle className="pl-1 text-sm">Create a new cookie</DialogTitle>
          <DialogClose asChild>
            <Button variant="outline-solid" aria-label="Close">
              <XIcon />
            </Button>
          </DialogClose>
        </DialogHeader>
        <DialogDescription className="sr-only py-2.5">Set cookie's options</DialogDescription>
        <div className="mb-auto p-2.5">
          <div className="border p-2.5">
            <CookieForm {...cookieStateProps} />
          </div>
        </div>
        <div
          className={cn(
            'fixed right-2.5 bottom-[11px] z-50 transition-all ease-in-out',
            displayActions === true ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
          )}>
          <DialogFooter className="bg-background border-primary flex items-center gap-1.5 border p-2.5 shadow-lg">
            <Button
              size="sm"
              disabled={state.hasError === true || isLoading === true}
              onClick={handleCreate}
              className="flex items-center gap-2.5">
              {isLoading === true ? (
                <RotateCcwIcon className="size-4 animate-spin" />
              ) : (
                <CheckIcon className="size-4" />
              )}
              <span>Create Cookie</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => closeDialog()}
              disabled={isLoading === true}
              className="flex items-center gap-2.5">
              <XIcon className="size-4" />
              <span>Discard</span>
            </Button>
          </DialogFooter>
        </div>
      </div>
    </DialogContent>
  );

  //#endregion
};

export default CreateCookieDialog;
