import { Outlet } from 'react-router-dom'
import './App.css'
import { NovaAtividade } from './pages/NovaAtividade'
import { NovaTurma } from './pages/NovaTurma'
import { Painel } from './pages/Painel'
import { Register } from './pages/Register'
import { NavigateApp } from './components/NavigateApp'

function App() {
  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col md:flex-row">

      {/* Navbar mobile */}
      <div className="md:hidden">
        <NavigateApp mobile />
      </div>

      {/* Sidebar desktop */}
      <div className="hidden md:block w-56 bg-gray-900">
        <NavigateApp />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Outlet />
      </main>

    </div>
  )
}

export default App
