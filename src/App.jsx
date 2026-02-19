import { Outlet } from 'react-router-dom'
import './App.css'
import { NovaAtividade } from './pages/NovaAtividade'
import { NovaTurma } from './pages/NovaTurma'
import { Painel } from './pages/Painel'
import { Register } from './pages/Register'
import { NavigateApp } from './components/NavigateApp'

function App() {


  return (
    <>
      <NavigateApp />
      <Outlet />
    </>
  )
}

export default App
