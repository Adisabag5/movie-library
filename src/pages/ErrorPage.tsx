import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  let message = 'Something went wrong.';
  if (isRouteErrorResponse(error)) {
    message = `${error.status} — ${error.statusText}`;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-4 text-center text-ink">
      <title>Something went wrong — Movie Library</title>

      <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-deep">Error</p>

      <h1 className="text-4xl font-black tracking-tight">Oops</h1>

      <p className="max-w-md font-medium text-ink-soft">{message}</p>

      <Link
        to="/"
        className="mt-2 rounded-full bg-accent px-6 py-2.5 font-bold text-paper shadow-lg shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Back home
      </Link>
    </div>
  );
};

export default ErrorPage;
