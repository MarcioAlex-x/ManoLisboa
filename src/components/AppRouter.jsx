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
import { AtualizarTurma } from "../pages/AtualizarTurma";
import { AtualizarAluno } from "../pages/AtualizarAluno";
import { AtualizarAtividade } from "../pages/AtualizarAtividade";
import { Usuario } from "../pages/Usuario";
import { AtividadesEntregues } from "../pages/AtividadesEntregues";
import { AtividadeEntregue } from "../pages/AtividadeEntregue";
import { AtualizarUsuario } from "../pages/AtualizarUsuario";
import { PortalInstituicao } from "../pages/PortalInstituicao";
import { AtividadesProfessor } from "../pages/AtividadesProfessor";
import { TurmasProfessor } from "../pages/TurmasProfessor";

export const AppRouter = createBrowserRouter([
    {
        path: '/', element: <App />, children: [
            {
                index: true, element:
                    <AcessoAluno />
            },
            {
                path: 'login', element: <Login />
            },
            {
                path: 'atividade/:id', element:
                    <Atividade />
            },
            
            {
                path: 'atividades-do-professor/:id', element:
                        <AtividadesProfessor />
            },
            {
                path: 'turmas-do-professor/:id', element:
                        <TurmasProfessor />
            },
            {
                path: 'atividade-recebidas/:id', element:
                    <ProtectedRoute>
                        <Atividade />
                    </ProtectedRoute>
            },
            {
                path: 'nova-atividade/:id', element:
                    <ProtectedRoute>
                        <NovaAtividade />
                    </ProtectedRoute>
            },
            {
                path: 'painel', element:
                    <ProtectedRoute>
                        <Painel />
                    </ProtectedRoute>
            },
            {
                path: 'nova-turma', element:
                    <ProtectedRoute>
                        <NovaTurma />
                    </ProtectedRoute>
            },
            {
                path: 'atividades', element:
                    <ProtectedRoute>
                        <Atividades />
                    </ProtectedRoute>
            },
            {
                path: 'turmas', element:
                    <ProtectedRoute>
                        <Turmas />
                    </ProtectedRoute>
            },
            {
                path: 'turma/:id', element:
                    <ProtectedRoute>
                        <Turma />
                    </ProtectedRoute>
            },
            {
                path: 'novo-aluno/:id', element:
                    <ProtectedRoute>
                        <NovoAluno />
                    </ProtectedRoute>
            },
            {
                path: 'alunos', element:
                    <ProtectedRoute>
                        <Alunos />
                    </ProtectedRoute>
            },
            {
                path: 'aluno/:id', element:
                    <ProtectedRoute>
                        <Aluno />
                    </ProtectedRoute>
            },
            {
                path: 'frequencia/:id', element:
                    <ProtectedRoute>
                        <Frequencia />
                    </ProtectedRoute>
            },
            {
                path: 'acesso-alunos', element: <AcessoAluno />
            },
            {
                path: 'entrega-atividade/:id', element: <EntregaAtividade />
            },
            {
                path: '/:codigo', element:
                    <PortalInstituicao />
            },
            {
                path: 'atualizar-turma/:id', element:
                    <ProtectedRoute>
                        <AtualizarTurma />
                    </ProtectedRoute>
            },
            {
                path: 'atualizar-aluno/:id', element:
                    <ProtectedRoute>
                        <AtualizarAluno />
                    </ProtectedRoute>
            },
            {
                path: 'atualizar-atividade/:id', element:
                    <ProtectedRoute>
                        <AtualizarAtividade />
                    </ProtectedRoute>
            },
            {
                path: 'atividades-recebidas', element:
                    <ProtectedRoute>
                        <AtividadesEntregues />
                    </ProtectedRoute>
            },
            {
                path: 'atividade-recebidas/:id', element:
                    <ProtectedRoute>
                        <AtividadeEntregue />
                    </ProtectedRoute>
            },
            {
                path: 'atualizar-usuario/:id', element:
                    <AdminRoute>
                        <ProtectedRoute>
                            <AtualizarUsuario />
                        </ProtectedRoute>
                    </AdminRoute>
            },

            {
                path: 'novo-usuario', element:
                    <AdminRoute>
                        <ProtectedRoute>
                            <Register />
                        </ProtectedRoute>
                    </AdminRoute>
            },
            {
                path: 'nova-instituicao', element:
                    <AdminRoute>
                        <ProtectedRoute>
                            <NovaInstituicao />
                        </ProtectedRoute>
                    </AdminRoute>
            },
            {
                path: 'usuario/:id', element:
                    <AdminRoute>
                        <ProtectedRoute>
                            <Usuario />
                        </ProtectedRoute>
                    </AdminRoute>
            },
        ]
    }
])
