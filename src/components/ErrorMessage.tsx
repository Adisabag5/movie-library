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

export default ErrorMessage
