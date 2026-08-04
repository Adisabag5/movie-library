import { useLocation } from 'react-router-dom'

export const LocationProbe = () => <span data-testid="url">{useLocation().search}</span>

export default LocationProbe
