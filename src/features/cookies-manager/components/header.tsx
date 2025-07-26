/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Input } from '@cookiri-extension/components/ui/input';
import { FilterIcon, PlusIcon } from 'lucide-react';
import { Button } from '@cookiri-extension/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { Separator } from '@cookiri-extension/components/ui/separator';
import { useDomainCookies } from '@cookiri-extension/providers/hooks/use-domain-cookies';
import { Tooltip, TooltipContent, TooltipTrigger } from '@cookiri-extension/components/ui/tooltip';
import { useCookieEditor } from '@cookiri-extension/providers/hooks/use-cookie-editor';
import { useLazyDialog } from '@cookiri-extension/providers/hooks/use-lazy-dialog';

//#region typings

type Props = {
  filterValue: string;
  setFilterValue: (value: string) => void;
};

//#endregion
//#region component

const PopupHeader = ({ filterValue, setFilterValue }: Props) => {
  //#region hooks

  const { data } = useDomainCookies();
  const { openDialog } = useLazyDialog();
  const { deleteAllCookies } = useCookieEditor();

  //#endregion
  //#region handlers

  const handleDeleteAll = async () => {
    const exec = confirm('Would you like to delete all cookies for this domain and its subdomains?');
    if (exec === true) {
      await deleteAllCookies();
    }
  };

  //#endregion
  //#region render

  const hasCookies = data !== void 0 && data.cookies.length !== 0;

  return (
    <div data-slot="popup-header" className="bg-background sticky top-0 w-full border-b-1 p-2.5">
      <div className="flex items-center gap-2.5">
        <div className="relative flex flex-1 items-center gap-2.5">
          <FilterIcon className="absolute top-2.25 left-3 size-3.5" />
          <Input
            disabled={hasCookies === false}
            className="pl-9 text-sm"
            placeholder="Filter by name"
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
          />
        </div>
        <Separator orientation="vertical" className="h-8!" />
        <div className="flex items-center gap-2.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={hasCookies === false}
                variant="outline-solid"
                aria-label="Delete all cookies"
                onClick={handleDeleteAll}>
                <Trash2Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Delete all cookies</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline-solid" aria-label="Create cookie" onClick={() => openDialog('create-cookie')}>
                <PlusIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Create cookie</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
  //#endregion
};

//#endregion

export { PopupHeader };
