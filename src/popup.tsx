/*!
 * Copyright (c) 2025 Alexis Bize
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import './styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesManager } from './features/cookies-manager/components';
import { LazyDialogProvider } from './providers/lazy-dialog';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LazyDialogProvider>
      <QueryClientProvider client={queryClient}>
        <CookiesManager />
      </QueryClientProvider>
    </LazyDialogProvider>
  </StrictMode>,
);
