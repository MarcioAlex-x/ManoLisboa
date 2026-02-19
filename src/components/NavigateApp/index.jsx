import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export const NavigateApp = () => {
    const { userData } = useContext(UserContext)
    const tipo = (userData?.tipo || '').toUpperCase()
    const nome = (userData?.nome || '').toUpperCase()

    const handleSubmit = () => {
        signOut(auth)
    }

    return (
        <nav className="navbar navbar-expand-lg m-0 p-0">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Mano Lisboa</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {userData ?
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                            <NavLink className='nav-link' to='/'>Painel</NavLink>
                            <NavLink className='nav-link' to='/nova-turma'>Nova Turma</NavLink>
                            <NavLink className='nav-link' to='/atividades'>Todas as Atividades</NavLink>
                            <NavLink className='nav-link' to='/turmas'>Todas as Turmas</NavLink>
                            <NavLink className='nav-link' to='/alunos'>Todos os alunos</NavLink>
                        </ul>
                        :
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <NavLink className='nav-link' to='/login' >Acesso Professor</NavLink>
                            <NavLink className='nav-link' to='/acesso-alunos' >Portal do Aluno</NavLink>
                        </ul>

                    }{userData &&
                        <div className="d-flex align-items-center">
                            <p className="align-middle my-0 me-2">{tipo} {nome}</p>
                            <button className="btn btn-sm btn-danger" onClick={handleSubmit}>Sair</button>
                        </div>
                    }
                </div>
            </div>
        </nav>
    )
}