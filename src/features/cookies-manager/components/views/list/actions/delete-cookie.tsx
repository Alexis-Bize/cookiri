/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Trash2Icon, TrashIcon } from 'lucide-react';
import { Button } from '@cookiri-extension/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@cookiri-extension/components/ui/tooltip';

//#region typings

type Props = {
  onClick: () => void;
  toBeDeleted: boolean;
};

//#endregion
//#region component

const DeleteCookieButton = ({ onClick, toBeDeleted }: Props) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        size="sm"
        variant={null}
        className="h-auto p-0! px-0.5!"
        aria-label={toBeDeleted === true ? 'Marked for deletion' : 'Mark for deletion'}
        onClick={onClick}>
        {toBeDeleted === true ? <Trash2Icon className="text-destructive" /> : <TrashIcon />}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">{toBeDeleted === true ? 'Marked for deletion' : 'Mark for deletion'}</TooltipContent>
  </Tooltip>
);

//#endregion

export { DeleteCookieButton };
