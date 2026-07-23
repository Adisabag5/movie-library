import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div>
        <h2>Page not found!</h2>
        <p> Go back to <Link to="/">Home page</Link></p>
    </div>
  )
}

export default PageNotFound