/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { Fragment, useMemo } from 'react';
import { PopupCookieListItem } from './item';
import { useDomainCookies } from '@cookiri-extension/providers/hooks/use-domain-cookies';
import { isTrackingCookie } from '@cookiri-extension/features/cookies-manager/modules/utilities/cookies/helpers';

//#region typings

type Props = {
  filterValue?: string;
};

//#endregion
//#region component

const PopupCookiesList = ({ filterValue = '' }: Props) => {
  //#region hooks

  const { data, isLoading } = useDomainCookies();

  //#endregion
  //#region memos

  const filteredCookies = useMemo(() => {
    const filtered =
      filterValue.trim().length !== 0
        ? data?.cookies.filter(cookie => cookie.name.toLowerCase().includes(filterValue.toLowerCase()))
        : data?.cookies;

    return (filtered || []).map(cookie => (
      <PopupCookieListItem
        key={cookie.name + cookie.domain + cookie.path}
        cookie={cookie}
        isTracker={isTrackingCookie(cookie.name) === true}
      />
    ));
  }, [data, filterValue]);

  //#endregion
  //#region render

  if (isLoading === true) {
    return null;
  }

  return (
    <Fragment>
      {filteredCookies.length === 0 && (
        <div className="flex items-center justify-center p-10">
          <p className="text-lg font-semibold">
            {data?.cookies.length ? 'No matching cookies found!' : 'No cookie here!'}
          </p>
        </div>
      )}
      {filteredCookies.length !== 0 && <ul className="space-y-2.5 p-2.5">{filteredCookies}</ul>}
    </Fragment>
  );

  //#endregion
};

//#endregion

export { PopupCookiesList };
