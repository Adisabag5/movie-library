import { Link } from 'react-router-dom'

interface ErrorMessageProps {
    message: string
    /** Pass a query's `refetch` to offer a retry. Omitted means no button. */
    onRetry?: () => void
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
    return (
        <div className="space-y-4 p-8 text-center">
            <p className="text-red-500">{message}</p>

            <div className="flex items-center justify-center gap-4">
                {/* A failed query is usually transient — a dropped connection
                    or a 5xx. Sending the user home to recover from that
                    throws away the page they actually wanted. */}
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                    >
                        Try again
                    </button>
                )}

                <Link to="/" className="text-sm text-zinc-400 underline hover:text-zinc-200">
                    Back home
                </Link>
            </div>
        </div>
    )
}

// Shown when a query is paused: TanStack Query wants to fetch but the
// browser reports no connection, so it waits instead of failing. Styled as
// a banner rather than a full-page message so it can sit *above* data we
// already have — stale results are still useful, they just need labelling.
export const OfflineBanner = () => (
    <p
        role="status"
        className="rounded-lg border border-amber-900/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-200"
    >
        You appear to be offline. Showing the most recent data — this will update as soon as you reconnect.
    </p>
)

export default ErrorMessage
