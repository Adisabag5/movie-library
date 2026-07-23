import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Collections from './pages/Collections';
import RootLayout from './layouts/RootLayout';
import PageNotFound from './pages/PageNotFound';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/series" element={<Series />} />
      <Route path="/collections" element={<Collections />} /> 
      <Route path="*" element={<PageNotFound />} />
    </Route>
    
))

const App = () => {
  return ( <RouterProvider router={router} /> )
}

export default App

