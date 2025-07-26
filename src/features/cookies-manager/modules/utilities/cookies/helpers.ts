/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import config from '@cookiri-extension/config/cookies';

//#region public methods

export const createCookieId = (cookie: chrome.cookies.Cookie): string =>
  [cookie.domain, cookie.name, cookie.path].join('|');

export const cookieToString = (cookie: chrome.cookies.Cookie): string => {
  return `${cookie.name}=${cookie.value}`;
};

export const isTrackingCookie = (cookieName: string): boolean => {
  return config.patterns.tracking.some(pat => pat.test(cookieName));
};

export const isCloudflareCookie = (cookieName: string): boolean => {
  return config.patterns.cloudflare.some(pat => pat.test(cookieName));
};

export const loadCurrentDomainCookies = (): Promise<{ domain: string | null; cookies: chrome.cookies.Cookie[] }> =>
  new Promise(resolve => {
    window.chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];
      if (tab?.url === void 0) {
        return resolve({ domain: null, cookies: [] });
      }

      const url = new URL(tab.url);
      const getParentDomain = (hostname: string) => {
        const parts = hostname.split('.');
        if (parts.length > 2) {
          return parts.slice(-2).join('.');
        } else return hostname;
      };

      const parentDomain = getParentDomain(url.hostname);
      const dotParentDomain = '.' + parentDomain;
      const allowedDomains = [url.hostname, parentDomain, dotParentDomain];

      chrome.cookies.getAll({ domain: url.hostname }, cookies1 => {
        chrome.cookies.getAll({ domain: parentDomain }, cookies2 => {
          chrome.cookies.getAll({ domain: dotParentDomain }, cookies3 => {
            const allCookies = [...cookies1, ...cookies2, ...cookies3].filter(
              (cookie, index, self) =>
                allowedDomains.includes(cookie.domain) &&
                index ===
                  self.findIndex(c => c.name === cookie.name && c.domain === cookie.domain && c.path === cookie.path),
            );

            // Sort cookies: HTTP Only > Secure > Host Only > Session > Other > Tracker (trackers always last)
            const sortedCookies = allCookies
              .map((cookie, index) => ({ cookie, originalIndex: index }))
              .sort((a, b) => {
                const aIsTracker = isTrackingCookie(a.cookie.name);
                const bIsTracker = isTrackingCookie(b.cookie.name);

                if (aIsTracker === true && bIsTracker === false) {
                  return 1;
                } else if (aIsTracker === false && bIsTracker === true) {
                  return -1;
                }

                const getPriority = (cookie: chrome.cookies.Cookie) => {
                  if (cookie.httpOnly === true) {
                    return 0;
                  } else if (cookie.secure === true) {
                    return 1;
                  } else if (cookie.hostOnly === true) {
                    return 2;
                  } else if (cookie.session === true) {
                    return 3;
                  } else {
                    return 4;
                  }
                };

                const aPriority = getPriority(a.cookie);
                const bPriority = getPriority(b.cookie);

                if (aPriority !== bPriority) {
                  return aPriority - bPriority;
                }

                const nameComparison = a.cookie.name.localeCompare(b.cookie.name);
                if (nameComparison !== 0) {
                  return nameComparison;
                }

                return a.originalIndex - b.originalIndex;
              })
              .map(({ cookie }) => cookie);

            return resolve({ domain: url.hostname, cookies: sortedCookies });
          });
        });
      });
    });
  });

//#endregion
