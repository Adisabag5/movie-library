import { Link } from 'react-router-dom'

const ErrorMessage = ({ message }: { message: string }) => {
    return (
        <div className="space-y-3 p-8 text-center">
            <p className="text-red-500">{message}</p>
            <Link to="/" className="inline-block text-sm text-zinc-400 underline hover:text-zinc-200">
                Back home
            </Link>
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
