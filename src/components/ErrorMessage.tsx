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
// browser reports no connection, so it waits instead of failing. Without
// this branch the page would sit on a skeleton indefinitely.
export const OfflineMessage = () => (
    <p className="p-8 text-center text-zinc-400">
        You appear to be offline. This will load as soon as you reconnect.
    </p>
)

export default ErrorMessage
