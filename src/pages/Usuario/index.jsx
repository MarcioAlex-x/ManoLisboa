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
        <div className="mt-10">
            <div className="border border-blue-700 p-4">
                <h2 className="text-center text-3xl">Informações do Usuário</h2>
                <h3>Nome: <span className="">{usuario?.nome}</span></h3>
                <h3>Instituição: <span className="">{instituicao?.instituicao}</span></h3>
                <p className="h5 mb-0">{turmas.length} turma(s)</p>
                <p className="h5">{alunos.length} aluno(s)</p>
                <p className="h5" >Tipo de usuário: <span style={{ textTransform: 'capitalize' }}>{usuario?.tipo}</span></p>
                <p className="h5">Status: {usuario?.ativo === true ? 'Ativo' : 'Inativo'}</p>
                <p className="h5 mb-3">Data de expiração: {usuario?.ativoAte.toDate().toLocaleDateString()}</p>

                <div className="grid grid-cols-2">
                    {
                        loading ?
                            <button
                                onClick={handleDetelete}
                                disabled
                                data-bs-toggle="button"
                                className="mt-4 cursor-pointer mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-orange-400 transition delay-150 ease-in-out hover:bg-green-900 font-bold">Excluir
                            </button>
                            :
                            <button
                                onClick={handleDetelete}
                                className="mt-4 cursor-pointer mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-orange-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold">Excluir
                            </button>
                    }

                    <Link
                        to={`/atualizar-usuario/${id}`}
                        className="mt-4 cursor-pointer mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold">Editar</Link>
                </div>
            </div>
            <div className="">
                <h2 className="text-center mt-10 text-3xl">Turmas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-5">
                    {turmas.length > 0 ?
                        turmas.map(turma => (
                            <Link
                                key={turma.id}
                                className="w-12/12 border border-blue-700 p-4 hover:bg-gray-700"
                                to={`/turma/${turma.id}`}>
                                {turma.serie}º {turma.turma}
                            </Link>
                        )) :
                        <p>Ainda não tem turmas cadastradas</p>
                    }
                </div>

                <h2 className="text-center text-3xl mt-10">Alunos</h2>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {alunos.length > 0 ? alunos.map(aluno => (
                        
                            <Link
                            key={aluno.id}
                                className="border border-blue-700 p-2 hover:bg-gray-700"
                                to={`/aluno/${aluno.id}`}>
                                {aluno.nome}
                            </Link>
                    )) :
                        <p>Ainda não tem alunos cadastrados</p>
                    }
                </div>
            </div>
        </div>
    )
}