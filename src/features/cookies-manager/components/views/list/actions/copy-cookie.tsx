/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ClipboardCopyIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@cookiri-extension/components/ui/button';
import { cn } from '../../../../../../shared/modules/utilities';
import { cookieToString } from '@cookiri-extension/features/cookies-manager/modules/utilities/cookies/helpers';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../../components/ui/tooltip';
import { safeAsync } from '@zeny/safe-async';

//#region typings

type Props = {
  cookie: chrome.cookies.Cookie;
};

//#endregion
//#region component

const CopyCookieButton = ({ cookie }: Props) => {
  //#region states

  const [copied, setCopied] = useState<boolean>(false);

  //#endregion
  //#region handlers

  const handleCopy = async () => {
    const [err] = await safeAsync(navigator.clipboard.writeText(cookieToString(cookie)));
    if (err === null) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  //#endregion
  //#region render

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          variant={null}
          className={cn('h-auto p-0! px-0.5!', copied === true && 'text-primary')}
          aria-label={copied === true ? 'Copied!' : 'Copy cookie'}
          onClick={handleCopy}>
          {copied === true ? <CheckIcon className="size-4" /> : <ClipboardCopyIcon className="size-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{copied === true ? 'Copied!' : 'Copy cookie'}</TooltipContent>
    </Tooltip>
  );

  //#endregion
};

//#endregion

export { CopyCookieButton };
