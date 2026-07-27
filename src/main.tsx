import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import { TmdbError } from './core/http.ts'

// One QueryClient for the whole app — it owns the cache of all server data.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Movie lists don't change often; treat data as fresh for 5 minutes
      // so navigating back to a page is instant instead of refetching.
      staleTime: 5 * 60 * 1000,

      // A 4xx means we asked for something that doesn't exist or isn't
      // allowed — asking three more times only delays the error the user
      // was always going to see. Retry network/server failures only.
      retry: (failureCount, error) => {
        if (error instanceof TmdbError && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
