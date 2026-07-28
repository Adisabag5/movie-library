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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-100">
      <h1 className="text-3xl font-bold">Oops</h1>
      <p className="text-zinc-400">{message}</p>
      <Link to="/" className="rounded-lg bg-red-600 px-5 py-2 font-medium transition-colors hover:bg-red-700">
        Back home
      </Link>
    </div>
  );
};

export default ErrorPage;
