import { LogoDark } from '../icons/Logo'
import { NavLink } from 'react-router-dom'


const toolbar = () => {

  return (
    <>
        <div className="toolbar-left">
            <LogoDark  />
        </div>

        <ul className="toolbar-right">
            <li> <NavLink to="/">Home</NavLink> </li>
            <li> <NavLink to="/movies">Movies</NavLink> </li>
            <li> <NavLink to="/series">Series</NavLink> </li>
            <li> <NavLink to="/collections">Collections</NavLink> </li>
        </ul>
    </>
  )
}

export default toolbar