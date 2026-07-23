import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';

// Object-based route config — the recommended style for React Router v7
// data routers. Each `lazy` route becomes its own JS chunk that the router
// downloads during navigation (not during render, like React.lazy would).
//
// Home stays a static import on purpose: it is the landing page, so its code
// should be in the main bundle — lazy-loading it would only delay first paint.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'movies',
        lazy: async () => ({ Component: (await import('./pages/Movies')).default }),
      },
      {
        path: 'series',
        lazy: async () => ({ Component: (await import('./pages/Series')).default }),
      },
      {
        path: 'collections',
        lazy: async () => ({ Component: (await import('./pages/Collections')).default }),
      },
      {
        path: 'movie/:id',
        lazy: async () => ({ Component: (await import('./pages/MovieDetails')).default }),
      },
      {
        path: 'series/:id',
        lazy: async () => ({ Component: (await import('./pages/SeriesDetails')).default }),
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await import('./pages/PageNotFound')).default }),
      },
    ],
  },
]);
