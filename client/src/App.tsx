
import { Outlet } from 'react-router-dom'
import './App.scss'

import Header from './views/components/header/Header'

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
