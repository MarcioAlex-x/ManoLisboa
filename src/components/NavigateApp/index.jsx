import { useContext, useState } from "react"
import { NavLink } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"
import { signOut } from "firebase/auth"
import { auth } from "../../firebaseConfig"

export const NavigateApp = ({ mobile }) => {
  const { userData } = useContext(UserContext)
  const [open, setOpen] = useState(false)

  const tipo = (userData?.tipo || '').toUpperCase()
  const nome = (userData?.nome || '').toUpperCase()

  const handleSubmit = () => {
    signOut(auth)
  }

  const Menu = () => (
    <div className="p-2">
      {userData ? (
        <ul className="flex flex-col gap-1">
          <NavLink className="p-2 rounded hover:bg-gray-800" to="/painel">Painel</NavLink>
          <NavLink className="p-2 rounded hover:bg-gray-800" to="/nova-turma">Nova Turma</NavLink>
          <NavLink className="p-2 rounded hover:bg-gray-800" to="/turmas">Todas as Turmas</NavLink>
          <NavLink className="p-2 rounded hover:bg-gray-800" to="/alunos">Todos os Alunos</NavLink>
          <NavLink className="p-2 rounded hover:bg-gray-800" to="/atividades">Todas as Atividades</NavLink>
          <NavLink className="p-2 rounded hover:bg-gray-800" to="/atividades-recebidas">Atividades Recebidas</NavLink>

          {userData.tipo === 'admin' && (
            <>
              <NavLink className="p-2 rounded hover:bg-gray-800" to="/nova-instituicao">Nova Instituição</NavLink>
              <NavLink className="p-2 rounded hover:bg-gray-800" to="/novo-usuario">Novo Usuário</NavLink>
            </>
          )}
        </ul>
      ) : (
        <ul className="flex flex-col gap-1">
          <NavLink className="p-2 rounded hover:bg-gray-800" to="/login">Acesso Professor</NavLink>
          <NavLink className="p-2 rounded hover:bg-gray-800" to="/acesso-alunos">Portal do Aluno</NavLink>
        </ul>
      )}

      {userData && (
        <div className="mt-6 border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-300">{tipo} {nome}</p>
          <button
            className="mt-2 w-full text-left p-2 rounded hover:bg-gray-800"
            onClick={handleSubmit}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )

  if (mobile) {
    return (
      <>
        {/* Topbar */}
        <div className="flex items-center justify-between p-3 bg-gray-900">
          <img src="/logominigera.png" className="w-8" />

          <button onClick={() => setOpen(true)}>
            ☰
          </button>
        </div>

        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />
        )}

        <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-50 transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="p-3 flex justify-between items-center border-b border-gray-700">
            <span className="font-bold">Menu</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <Menu />
        </div>
      </>
    )
  }

  return (
    <nav className="mt-2">
      <img
        className="m-auto rounded"
        src="/logominigera.png"
        style={{ maxWidth: '50px' }}
      />
      <Menu />
    </nav>
  )
}