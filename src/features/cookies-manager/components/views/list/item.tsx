/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import CloudflareLogo from '@cookiri-extension/components/icons/cloudflare.svg?react';
import { useId } from 'react';
import { Badge } from '../../../../../components/ui/badge';
import { Separator } from '../../../../../components/ui/separator';
import { truncateText } from '../../../../../shared/modules/utilities';
import { cn } from '../../../../../shared/modules/utilities';
import { useCookieState } from '../../../hooks/use-cookie-state';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../../../components/ui/accordion';
import { CopyCookieButton } from './actions/copy-cookie';
import { DeleteCookieButton } from './actions/delete-cookie';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../components/ui/tooltip';
import { isCloudflareCookie } from '@cookiri-extension/features/cookies-manager/modules/utilities/cookies/helpers';

import {
  BugIcon,
  CheckIcon,
  ClockIcon,
  FilePenIcon,
  LockIcon,
  LockOpenIcon,
  ServerOffIcon,
  ShieldCheckIcon,
  XIcon,
} from 'lucide-react';
import { CookieForm } from '../../form';

//#region typings

type Props = {
  cookie: chrome.cookies.Cookie;
  isTracker: boolean;
};

//#endregion
//#region component

const PopupCookieListItem = ({ cookie, isTracker }: Props) => {
  //#region hooks

  const id = useId();
  const cookieStateProps = useCookieState(cookie);
  const { state, actions, isModified } = cookieStateProps;

  //#endregion
  //#region handlers

  const handleAccordionChange = () => {
    const accordionElement = document.getElementById(`accordion-${id}`);
    const scrollableContainer = document.querySelector('[data-slot="popup-cookies"]');

    if (accordionElement !== null && scrollableContainer !== null) {
      // Get the accordion's position relative to the scrollable container
      const accordionRect = accordionElement.getBoundingClientRect();
      const containerRect = scrollableContainer.getBoundingClientRect();

      const accordionTop = accordionRect.top - containerRect.top;
      const targetOffset = 21;

      // Calculate the scroll position needed
      const currentScrollTop = scrollableContainer.scrollTop;
      const targetScrollTop = currentScrollTop + accordionTop - targetOffset;

      scrollableContainer.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  };

  const handleDeleteClick = () => {
    actions.markForDeletion(!state.toBeDeleted);
  };

  //#endregion
  //#region render

  return (
    <li
      className={cn(
        'border p-2.5',
        state.toBeDeleted === true && 'border-destructive border-dashed',
        state.toBeDeleted === false && isModified === true && 'border-primary border-dashed',
      )}>
      <div className="space-y-2.5">
        <Accordion type="single" collapsible={true} onValueChange={handleAccordionChange}>
          <AccordionItem value="cookie">
            <AccordionTrigger id={`accordion-${id}`} className="cursor-pointer p-0 text-sm">
              <div className="flex items-center gap-1.5">
                {state.toBeDeleted === true && <XIcon className="text-destructive size-4" />}
                {state.toBeDeleted === false && isModified === true && (
                  <FilePenIcon className="text-primary/50 size-4" />
                )}
                <span
                  className={cn(state.toBeDeleted === true ? 'text-muted-foreground text-sm line-through' : void 0)}>
                  {truncateText(state.name || 'N/A', 64)}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2.5 p-0! pt-2.5!">
              <Separator />
              <CookieForm {...cookieStateProps} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            {isTracker === true && (
              <Badge variant="destructive">
                <BugIcon />
                <span>Tracker</span>
              </Badge>
            )}
            {state.hostOnly === true && (
              <Badge>
                <ServerOffIcon />
                <span>Host Only</span>
              </Badge>
            )}
            <Badge variant={state.secure === true ? void 0 : 'secondary'}>
              {state.secure === true ? <LockIcon /> : <LockOpenIcon />}
              <span className={state.secure === true ? void 0 : 'line-through'}>Secure</span>
            </Badge>
            {state.httpOnly === true && (
              <Badge>
                <CheckIcon />
                <span>HTTP Only</span>
              </Badge>
            )}
            {state.session === true && (
              <Badge variant="outline">
                <ClockIcon />
                <span>Session</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <CopyCookieButton cookie={cookie} />
            <DeleteCookieButton onClick={handleDeleteClick} toBeDeleted={state.toBeDeleted === true} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2.5">
          <p className="text-muted-foreground text-xs">
            Domain: <strong>{state.domain}</strong>
          </p>
          {isCloudflareCookie(cookie.name) === true && (
            <Tooltip>
              <TooltipTrigger asChild>
                <CloudflareLogo className="size-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex items-center gap-1.5">
                <ShieldCheckIcon className="size-3.5" />
                <span>Cloudflare</span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </li>
  );

  //#endregion
};

//#endregion

export { PopupCookieListItem };
