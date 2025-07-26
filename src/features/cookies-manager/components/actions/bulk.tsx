/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Button } from '@cookiri-extension/components/ui/button';
import { RotateCcwIcon, SaveIcon, XIcon } from 'lucide-react';
import { useCookieEditor } from '@cookiri-extension/providers/hooks/use-cookie-editor';
import { useState } from 'react';
import { cn } from '@cookiri-extension/shared/modules/utilities';
import { safeAsync } from '@zeny/safe-async';

//#region component

const BulkActions = () => {
  //#region hooks

  const { hasPendingUpdates, saveAllChanges, discardAllChanges } = useCookieEditor();

  //#endregion
  //#region states

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //#endregion
  //#region handlers

  const handleSave = async () => {
    if (isLoading === true) {
      return;
    }

    setIsLoading(true);
    const [err] = await safeAsync(saveAllChanges());
    if (err !== null) {
      console.error(err);
    }

    setIsLoading(false);
  };

  const handleDiscard = () => {
    discardAllChanges();
  };

  //#endregion
  //#region render

  const shouldDisplay = hasPendingUpdates === true;

  return (
    <div
      className={cn(
        'fixed right-2.5 bottom-[11px] z-50 transition-all ease-in-out',
        shouldDisplay === true ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
      )}>
      <div className="bg-background border-primary flex items-center gap-1.5 border p-2.5 shadow-lg">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isLoading === true || shouldDisplay === false}
          className="flex items-center gap-2.5">
          {isLoading === true ? <RotateCcwIcon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
          <span>Save Changes</span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleDiscard}
          disabled={isLoading === true || shouldDisplay === false}
          className="flex items-center gap-2.5">
          <XIcon className="size-4" />
          <span>Discard</span>
        </Button>
      </div>
    </div>
  );

  //#endregion
};

//#endregion

export { BulkActions };
