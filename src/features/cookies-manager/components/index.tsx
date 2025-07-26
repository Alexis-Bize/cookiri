/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { useState } from 'react';
import { PopupFooter } from './footer';
import { PopupHeader } from './header';
import { BulkActions } from './actions/bulk';
import { PopupCookiesList } from './views/list';
import { DomainCookiesProvider } from '../../../providers/domain-cookies';
import { CookieEditorProvider } from '../../../providers/cookie-editor';
import { useLazyDialog } from '@cookiri-extension/providers/hooks/use-lazy-dialog';

//#region component

const CookiesManager = () => {
  //#region hooks

  const { DialogElement } = useLazyDialog();

  //#endregion
  //#region states

  const [filterValue, setFilterValue] = useState<string>('');

  //#endregion
  //#region render

  return (
    <DomainCookiesProvider>
      <CookieEditorProvider>
        <div className="flex h-screen flex-col">
          <PopupHeader filterValue={filterValue} setFilterValue={setFilterValue} />
          <section data-slot="popup-cookies" className="flex-1 overflow-auto">
            <PopupCookiesList filterValue={filterValue} />
          </section>
          <PopupFooter />
        </div>
        <BulkActions />
        {DialogElement}
      </CookieEditorProvider>
    </DomainCookiesProvider>
  );

  //#endregion
};

//#endregion

export { CookiesManager };
