/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useDomainCookies } from '@cookiri-extension/providers/hooks/use-domain-cookies';

//#region component

const PopupFooter = () => {
  //#region hooks

  const { data } = useDomainCookies();

  //#endregion
  //#region render

  return (
    <footer className="bg-background w-full space-y-2.5 border-t-1 p-2.5">
      <div data-slot="website" className="flex items-center justify-between gap-2.5">
        <p>
          Domain: <strong>{data?.domain ?? 'N/A'}</strong>
        </p>
        <p>
          <strong>{data?.cookies.length ?? 0} cookie(s)</strong>
        </p>
      </div>
    </footer>
  );

  //#endregion
};

//#endregion

export { PopupFooter };
