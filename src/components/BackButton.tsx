import { useLocation, useNavigate } from 'react-router-dom'

interface BackButtonProps {
    fallback: string
    label: string
}

const BackButton = ({ fallback, label }: BackButtonProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const goBack = () => {
        if (location.key === 'default') {
            void navigate(fallback)
        } else {
            void navigate(-1)
        }
    }

    return (
        <button
            type="button"
            onClick={goBack}
            className="group mb-6 inline-flex items-center gap-2 rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink-soft ring-1 ring-bark/50 transition-all duration-300 hover:-translate-x-0.5 hover:bg-accent hover:text-paper hover:ring-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
            </span>
            {label}
        </button>
    )
}

export default BackButton
