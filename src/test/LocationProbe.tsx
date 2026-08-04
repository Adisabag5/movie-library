import { useLocation } from 'react-router-dom'

/**
 * Renders the live query string so a test can assert on the URL a page
 * actually produced, rather than on its internal state. Read it with
 * `currentUrl()` from ./utils.
 *
 * Lives in its own file because a module that exports both a component and
 * plain helpers trips react-refresh's only-export-components rule.
 */
export const LocationProbe = () => <span data-testid="url">{useLocation().search}</span>

export default LocationProbe
