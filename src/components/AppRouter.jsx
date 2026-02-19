import { createBrowserRouter } from "react-router-dom";
import App from '../App'
import { Atividades } from "../pages/Atividades";
import { NovaAtividade } from "../pages/NovaAtividade";
import { NovaTurma } from "../pages/NovaTurma";
import { Painel } from "../pages/Painel";
import { Turmas } from "../pages/Turmas";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { Turma } from "../pages/Turma";
import { AdminRoute } from "./AdminRouter";
import { Atividade } from "../pages/Atividade";
import { NovoAluno } from "../pages/NovoAluno";
import { Alunos } from "../pages/Alunos";
import { Aluno } from "../pages/Aluno";
import { Frequencia } from "../pages/Frequencia";
import { AcessoAluno } from "../pages/AcessoAluno";
import { EntregaAtividade } from "../pages/EntregaAtividade";
import { NovaInstituicao } from "../pages/NovaInstituicao";

export const AppRouter = createBrowserRouter([
    {
        path: '/', element: <App />, children: [
            {
                index: true, element:
                    <ProtectedRoute>
                        <Painel />
                    </ProtectedRoute>
            },
            {
                path: 'login', element: <Login />
            },
            {
                path: '/novo-usuario', element:
                    <ProtectedRoute>
                        <AdminRoute>
                            <Register />
                        </AdminRoute>
                    </ProtectedRoute>
            },
            {
                path: '/nova-atividade/:id', element:
                    <ProtectedRoute>
                        <NovaAtividade />
                    </ProtectedRoute>
            },
            {
                path: '/nova-turma', element:
                    <ProtectedRoute>
                        <NovaTurma />
                    </ProtectedRoute>
            },
            {
                path: '/atividades', element:
                    <ProtectedRoute>
                        <Atividades />
                    </ProtectedRoute>
            },
            {
                path: '/atividade/:id', element:
                    <ProtectedRoute>
                        <Atividade />
                    </ProtectedRoute>
            },
            {
                path: '/turmas', element:
                    <ProtectedRoute>
                        <Turmas />
                    </ProtectedRoute>
            },
            {
                path: '/turma/:id', element:
                    <ProtectedRoute>
                        <Turma />
                    </ProtectedRoute>
            },
            {
                path: '/novo-aluno/:id', element:
                <ProtectedRoute>
                    <NovoAluno/>
                </ProtectedRoute>
            },
            {
                path: '/alunos', element:
                <ProtectedRoute>
                    <Alunos /> 
                </ProtectedRoute>
            },
            {
                path: '/aluno/:id', element:
                <ProtectedRoute>
                    <Aluno />
                </ProtectedRoute>
            },
            {
                path: '/frequencia/:id', element:
                <ProtectedRoute>
                    <Frequencia />
                </ProtectedRoute>
            },
            {
                path:'/acesso-alunos', element: <AcessoAluno />
            },
            {
                path:'/entrega-atividade/:id', element: <EntregaAtividade />
            },
            {
                path: '/nova-instituicao', element:
                <ProtectedRoute>
                    <AdminRoute>
                        <NovaInstituicao />
                    </AdminRoute>
                </ProtectedRoute>
            }
        ]
    }
])
