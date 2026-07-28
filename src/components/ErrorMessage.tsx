import { Link } from 'react-router-dom'

interface ErrorMessageProps {
    message: string
    onRetry?: () => void
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
    return (
        <div className="space-y-4 p-8 text-center">
            <p className="text-red-500">{message}</p>

            <div className="flex items-center justify-center gap-4">
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

export const OfflineBanner = () => (
    <p
        role="status"
        className="animate-fade-up rounded-2xl border border-marigold/60 bg-marigold/15 px-4 py-3 text-sm font-medium text-clay-deep"
    >
        You appear to be offline. Showing the most recent data — this will update as soon as you reconnect.
    </p>
)

export default ErrorMessage
