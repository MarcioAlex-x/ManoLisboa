import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { ArrowRight } from "lucide-react"
import Swal from "sweetalert2"
import { deleteByQuery } from "../../deleteByQuery"

export const Usuario = () => {
    const [usuario, setUsuario] = useState(null)
    const [instituicao, setInsituicao] = useState(null)
    const [alunos, setAlunos] = useState([])
    const [turmas, setTurmas] = useState([])
    const [loading, setLoading] = useState(false)

    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usuarioRef = doc(db, 'usuarios', id)
                const usuarioSnapshot = await getDoc(usuarioRef)
                const usuarioData = {
                    id: usuarioSnapshot.id, ...usuarioSnapshot.data()
                }

                const instituicaoRef = doc(db, 'instituicoes', usuarioData.instituicaoId)
                const instituicaoSnapshot = await getDoc(instituicaoRef)
                const instiuicaoData = {
                    id: instituicaoSnapshot.id, ...instituicaoSnapshot.data()
                }
                console.log(instiuicaoData)

                const alunosRef = query(collection(db, 'alunos'), where('professorId', '==', id))
                const alunosSnapshot = await getDocs(alunosRef)
                const alunosData = alunosSnapshot.docs.map(doc => ({
                    id: doc.id, ...doc.data()
                }))

                const turmasRef = query(collection(db, 'turmas'), where('professorId', '==', id))
                const turmasSnapshot = await getDocs(turmasRef)
                const turmasData = turmasSnapshot.docs.map(doc => ({
                    id: doc.id, ...doc.data()
                }))

                setTurmas(turmasData)
                setAlunos(alunosData)
                setUsuario(usuarioData)
                setInsituicao(instiuicaoData)

            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()
    }, [id])

    const handleDetelete = async () => {
        setLoading(true)
        try {
            const confirm = await Swal.fire({
                icon: 'warning',
                title: 'Tem certeza?',
                text: 'Após apagar o usuário as informações não poderão ser recuperadas',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Apagar',
                cancelButtonText: 'Cancelar'
            })

            if (!confirm.isConfirmed) return

            await deleteByQuery(query(collection(db, 'turmas'), where('professorId', '==', id)))

            await deleteByQuery(query(collection(db, 'alunos'), where('professorId', '==', id)))

            await deleteByQuery(query(collection(db, 'atividades'), where('professorId', '==', id)))

            await deleteByQuery(query(collection(db, 'entregas'), where('professorId', '==', id)))

            await deleteByQuery(query(collection(db, 'frequencia'), where('professorId', '==', id)))

            await deleteDoc(doc(db, 'usuarios', id))

            await Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Professor apagado com sucesso',
                timer: 1500,
                timerProgressBar: 1500
            })

            navigate('/painel')

        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mt-5 bg-light p-lg-5 rounded ">
            <div className="p-2 border rounded p-4 shadow">
                <h2 className="text-center my-5">Informações do Usuário</h2>
                <h3>Nome: <span className="text-secondary">{usuario?.nome}</span></h3>
                <h3>Instituição: <span className="text-secondary">{instituicao?.instituicao}</span></h3>
                <p className="h5 mb-0">{turmas.length} turma(s)</p>
                <p className="h5">{alunos.length} aluno(s)</p>
                <p className="h5" >Tipo de usuário: <span style={{textTransform:'capitalize'}}>{usuario?.tipo}</span></p>
                <p className="h5">Status: {usuario?.ativo === true? 'Ativo' : 'Inativo'}</p>
                <p className="h5 mb-3">Data de expiração: {usuario?.ativoAte.toDate().toLocaleDateString()}</p>

                <div className="d-flex justify-content-around w-75 m-auto">
                    {
                        loading ?
                            <button
                                onClick={handleDetelete}
                                disabled
                                data-bs-toggle="button"
                                className="btn btn-danger">Excluir
                            </button>
                            :
                            <button
                                onClick={handleDetelete}
                                className="btn btn-danger">Excluir
                            </button>
                    }

                    <Link 
                    to={`/atualizar-usuario/${id}`}
                    className="btn btn-primary">Editar</Link>
                </div>
            </div>
            <div className="border rounded p-4 mt-4 shadow ">
                <h2>Turmas</h2>
                <div className="d-flex flex-wrap">
                    {turmas.length > 0 ?
                        turmas.map(turma => (
                            <div
                                key={turma.id}>
                                <p className="border rounded shadow p-3 m-2 d-flex m-1 scale">{turma.serie}º {turma.turma}
                                    <Link
                                        className="nav-link ms-1"
                                        to={`/turma/${turma.id}`}>
                                        <ArrowRight size={16} />
                                    </Link>
                                </p>
                            </div>
                        )) :
                        <p>Ainda não tem turmas cadastradas</p>
                    }
                </div>

                <h2 className="mt-4">Alunos</h2>
                <div className="d-flex flex-wrap">
                    {alunos.length > 0 ? alunos.map(aluno => (
                        <div
                            key={aluno.id}>
                            <p className="p-2 border rounded shadow d-flex m-1 scale">{aluno.nome}
                                <Link
                                    className="nav-link ms-1"
                                    to={`/aluno/${aluno.id}`}>
                                    <ArrowRight size={16} />
                                </Link>
                            </p>
                        </div>
                    )) :
                        <p>Ainda não tem alunos cadastrados</p>
                    }
                </div>
            </div>
        </div>
    )
}