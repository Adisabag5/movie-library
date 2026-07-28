import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import { DetailsSkeleton, GridSkeleton } from './components/Skeletons';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'movies',
        HydrateFallback: GridSkeleton,
        lazy: async () => ({ Component: (await import('./pages/Movies')).default }),
      },
      {
        path: 'series',
        HydrateFallback: GridSkeleton,
        lazy: async () => ({ Component: (await import('./pages/Series')).default }),
      },
      {
        path: 'collections',
        HydrateFallback: GridSkeleton,
        lazy: async () => ({ Component: (await import('./pages/Collections')).default }),
      },
      {
        path: 'movie/:id',
        HydrateFallback: DetailsSkeleton,
        lazy: async () => ({ Component: (await import('./pages/MovieDetails')).default }),
      },
      {
        path: 'series/:id',
        HydrateFallback: DetailsSkeleton,
        lazy: async () => ({ Component: (await import('./pages/SeriesDetails')).default }),
      },
      {
        path: '*',
        HydrateFallback: () => null,
        lazy: async () => ({ Component: (await import('./pages/PageNotFound')).default }),
      },
    ],
  },
]);
