import { Link } from 'react-router-dom'

interface ErrorMessageProps {
    message: string
    onRetry?: () => void
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
    return (
        <div className="space-y-4 p-8 text-center">
            <p className="font-semibold text-oxblood">{message}</p>

            <div className="flex items-center justify-center gap-4">
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-paper shadow-sm shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                        Try again
                    </button>
                )}

                <Link to="/" className="text-sm font-semibold text-ink-soft underline underline-offset-4 transition-colors hover:text-accent">
                    Back home
                </Link>
            </div>
        </div>
    )
}

export const OfflineBanner = () => (
    <p
        role="status"
        className="animate-fade-up rounded-2xl border border-accent-soft/60 bg-accent-soft/15 px-4 py-3 text-sm font-medium text-accent-deep"
    >
        You appear to be offline. Showing the most recent data — this will update as soon as you reconnect.
    </p>
)

export default ErrorMessage
