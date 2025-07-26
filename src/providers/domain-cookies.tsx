/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { createContext, type ReactNode } from 'react';
import { loadCurrentDomainCookies } from '@cookiri-extension/features/cookies-manager/modules/utilities/cookies/helpers';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

//#region typings

type DomainCookiesContextType = UseQueryResult<Awaited<ReturnType<typeof loadCurrentDomainCookies>>, Error>;

type Props = {
  children: ReactNode;
};

//#endregion
//#region context

const DomainCookiesContext = createContext<DomainCookiesContextType | void>(void 0);

//#endregion
//#region component

const DomainCookiesProvider = ({ children }: Props) => {
  //#region hooks

  const query = useQuery({
    queryKey: ['cookies'],
    queryFn: () => loadCurrentDomainCookies(),
  });

  //#endregion
  //#region render

  return <DomainCookiesContext.Provider value={query}>{children}</DomainCookiesContext.Provider>;

  //#endregion
};

//#endregion

export { DomainCookiesProvider, DomainCookiesContext };
