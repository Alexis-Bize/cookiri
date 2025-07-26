/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useEffect, useId, useMemo } from 'react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { useCookieState } from '../hooks/use-cookie-state';
import { Textarea } from '../../../components/ui/textarea';
import { Separator } from '@cookiri-extension/components/ui/separator';
import { Checkbox } from '@cookiri-extension/components/ui/checkbox';
import { addYears, format, isValid } from 'date-fns';
import { cn } from '@cookiri-extension/shared/modules/utilities';
import { safeValidateCookieCreation } from '../schemas/cookie';
import { CheckIcon, XIcon } from 'lucide-react';
import { useDomainCookies } from '@cookiri-extension/providers/hooks/use-domain-cookies';

//#region typings

type ValidationErrors = {
  name?: string;
  value?: string;
  domain?: string;
  path?: string;
  url?: string;
  secure?: string;
  expirationDate?: string;
  // Custom paths
  totalSize?: string;
};

type Props = ReturnType<typeof useCookieState>;

//#endregion
//#region component

const CookieForm = ({ state, cookie, actions }: Props) => {
  //#region hooks

  const id = useId();
  const { data } = useDomainCookies();

  //#endregion
  //#region memos

  const validationErrors = useMemo((): ValidationErrors => {
    const cookieData = {
      name: state.name,
      value: state.value,
      domain: state.domain || void 0,
      path: state.path,
      secure: state.secure,
      httpOnly: state.httpOnly,
      sameSite: state.sameSite,
      expirationDate: state.expirationDate,
      storeId: state.storeId || 'default',
    };

    const result = safeValidateCookieCreation(cookieData);
    if (result.success === true) {
      return {};
    }

    const errors: ValidationErrors = {};
    result.error.issues.forEach(issue => {
      const path = issue.path[0] as keyof ValidationErrors;
      if (path !== void 0 && errors[path] === void 0) {
        errors[path] = issue.message;
      }
    });

    return errors;
  }, [
    state.name,
    state.value,
    state.domain,
    state.path,
    state.secure,
    state.httpOnly,
    state.sameSite,
    state.expirationDate,
    state.storeId,
  ]);

  const hasErrors = useMemo(() => Object.keys(validationErrors).length !== 0, [validationErrors]);

  //#endregion
  //#region effects

  useEffect(() => {
    actions.flagAsErrored(hasErrors);
  }, [actions, hasErrors]);

  //#endregion
  //#region handlers

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    actions.setDomain(val);
    actions.setHostOnly(val.startsWith('.') === false);
  };

  const handleSessionChange = (checked: boolean) => {
    actions.setSession(checked);
    if (checked === true) {
      actions.setExpirationDate(void 0);
      return;
    }

    if (state.expirationDate === void 0) {
      const defaultDate = addYears(new Date(), 1);
      actions.setExpirationDate(Math.floor(defaultDate.valueOf() / 1000));
    }
  };

  const handleCheckedChange = (setter: (v: boolean) => void) => (checked: boolean | 'indeterminate') => {
    if (checked !== 'indeterminate') {
      setter(checked);
    }
  };

  //#endregion
  //#region render

  const cookieExpirationStringDate =
    (!!state.expirationDate && format(state.expirationDate * 1000, "yyyy-MM-dd'T'HH:mm")) || void 0;

  return (
    <form onSubmit={e => e.preventDefault()} className="space-y-2.5">
      <div className="space-y-3.5 p-1.5">
        <div className="grid w-full gap-2">
          <Label htmlFor={`${id}-cookie-name`} className={validationErrors.name !== void 0 ? 'text-destructive' : ''}>
            Name:
          </Label>
          <Input
            id={`${id}-cookie-name`}
            value={state.name}
            placeholder="Name"
            minLength={1}
            maxLength={4096}
            className={cn('text-sm', validationErrors.name && 'border-destructive')}
            onChange={e => actions.setName(e.target.value)}
            disabled={state.toBeDeleted === true}
            aria-invalid={!!validationErrors.name}
          />
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor={`${id}-cookie-value`} className={validationErrors.value !== void 0 ? 'text-destructive' : ''}>
            Value:
          </Label>
          <Textarea
            id={`${id}-cookie-value`}
            value={state.value}
            placeholder="Value"
            minLength={0}
            maxLength={4096}
            rows={4}
            className={cn('text-sm', validationErrors.value !== void 0 && 'border-destructive')}
            onChange={e => actions.setValue(e.target.value)}
            disabled={state.toBeDeleted === true}
            aria-invalid={!!validationErrors.value}
          />
        </div>

        <div className="flex items-center gap-3.5">
          <div className="grid w-full gap-2">
            <Label
              htmlFor={`${id}-cookie-domain`}
              className={validationErrors.domain !== void 0 ? 'text-destructive' : ''}>
              Domain:
            </Label>
            <Input
              id={`${id}-cookie-domain`}
              value={state.domain}
              placeholder={cookie.domain || data?.domain || 'Domain'}
              minLength={0}
              maxLength={253}
              onChange={handleDomainChange}
              className={cn('text-sm', validationErrors.domain && 'border-destructive')}
              disabled={state.toBeDeleted === true}
              aria-invalid={!!validationErrors.domain}
            />
          </div>
          <div className="grid w-full gap-2">
            <Label htmlFor={`${id}-cookie-path`} className={validationErrors.path !== void 0 ? 'text-destructive' : ''}>
              Path:
            </Label>
            <Input
              id={`${id}-cookie-path`}
              value={state.path}
              placeholder="Path"
              minLength={1}
              maxLength={4096}
              onChange={e => actions.setPath(e.target.value)}
              className={cn('text-sm', validationErrors.path && 'border-destructive')}
              disabled={state.toBeDeleted === true}
              aria-invalid={!!validationErrors.path}
            />
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="grid w-full gap-2">
            <Label htmlFor={`${id}-cookie-expiry`}>Expiration:</Label>
            <Input
              id={`${id}-cookie-expiry`}
              type="datetime-local"
              value={cookieExpirationStringDate}
              onChange={e => {
                const date = new Date(e.target.value);
                if (isValid(date) === false) {
                  actions.setExpirationDate(void 0);
                } else actions.setExpirationDate(Math.floor(date.valueOf() / 1000));
              }}
              disabled={state.session || state.toBeDeleted === true}
              className={cn(
                'relative text-sm',
                validationErrors.expirationDate !== void 0 && 'border-destructive',
                '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:filter',
              )}
            />
          </div>
          <div className="grid w-full gap-2">
            <Label htmlFor={`${id}-cookie-samesite`}>SameSite:</Label>
            <select
              id={`${id}-cookie-samesite`}
              className={cn(
                'text-sm',
                'h-8 appearance-none!',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              )}
              value={state.sameSite}
              onChange={e => actions.setSameSite(e.target.value as chrome.cookies.SameSiteStatus)}
              disabled={state.toBeDeleted === true}>
              {(['unspecified', 'no_restriction', 'lax', 'strict'] as const).map(opt => (
                <option key={opt} value={opt} disabled={opt === 'no_restriction' && state.secure === false}>
                  {opt === 'lax'
                    ? 'Lax'
                    : opt === 'strict'
                      ? 'Strict'
                      : opt === 'no_restriction'
                        ? 'None'
                        : 'Unspecified'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-2.5 p-1.5">
        <Label>
          <Checkbox
            checked={state.httpOnly}
            onCheckedChange={handleCheckedChange(actions.setHttpOnly)}
            disabled={state.toBeDeleted === true}
          />{' '}
          <span>HTTP Only</span>
        </Label>
        <Separator orientation="vertical" className="h-4!" />
        <Label>
          <Checkbox
            checked={state.secure}
            onCheckedChange={handleCheckedChange(actions.setSecure)}
            disabled={state.toBeDeleted === true}
          />{' '}
          <span>Secure</span>
        </Label>
        <Separator orientation="vertical" className="h-4!" />
        <Label>
          <Checkbox
            checked={state.session}
            onCheckedChange={handleSessionChange}
            disabled={state.toBeDeleted === true}
          />{' '}
          <span>Session</span>
        </Label>
      </div>

      <Separator />

      {hasErrors === true && (
        <div className="bg-destructive/10 text-destructive flex items-center gap-2.5 p-3 text-sm">
          <XIcon className="size-3.5" />
          {/** @ts-expect-error types */}
          <span>{validationErrors[Object.keys(validationErrors)[0]]}</span>
        </div>
      )}

      {hasErrors === false && (
        <div className="flex items-center gap-2.5 bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-300">
          <CheckIcon className="size-3.5" />
          <span>Cookie configuration is valid</span>
        </div>
      )}
    </form>
  );

  //#endregion
};

//#endregion

export { CookieForm };
