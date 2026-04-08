import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { ArrowBigRightDash, File, FileCheck2, FilePlus, FileUser, Trash, UserPlus } from "lucide-react"
import Swal from "sweetalert2"
import { deleteByQuery } from "../../deleteByQuery"
import { UserContext } from "../../contexts/UserContext"

export const Turma = () => {

    const [atividades, setAtividades] = useState([])
    const [alunos, setAlunos] = useState([])
    const [turma, setTurma] = useState(null)
    const [loading, setLoading] = useState(false)

    const { userData } = useContext(UserContext)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const atividadesRef = query(collection(db, 'atividades'), where('turmaId', '==', id))
                const atividadesSnapshot = await getDocs(atividadesRef)
                const atividades = atividadesSnapshot.docs.map(doc => ({
                    id: doc.id, ...doc.data()
                }))

                const turmaRef = doc(db, 'turmas', id)
                const turmaSnaphot = await getDoc(turmaRef)
                const turma = turmaSnaphot.data()

                const alunosRef = query(collection(db, 'alunos'), where('turmaId', '==', id), orderBy('nome'))
                const alunosSnapshot = await getDocs(alunosRef)
                const alunos = alunosSnapshot.docs.map(aluno => (
                    { id: aluno.id, ...aluno.data() }
                ))

                setTurma(turma)
                setAtividades(atividades)
                setAlunos(alunos)
            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()
    }, [id])

    const handleDelete = async () => {

        setLoading(true)

        try {
            const confirm = await Swal.fire({
                icon: 'warning',
                title: 'Tem certeza?',
                text: 'A ação não poderá ser desfeita',
                showConfirmButton: true,
                showCancelButton: true
            })

            if (confirm.isConfirmed) {

                await deleteByQuery(
                    query(collection(db, 'frequencias'), where('turmaId', '==', id))
                )

                await deleteByQuery(
                    query(collection(db, 'atividades'), where('turmaId', '==', id))
                )

                await deleteByQuery(
                    query(collection(db, 'alunos'), where('turmaId', '==', id))
                )

                await deleteByQuery(
                    query(collection(db, 'entregas'), where('turmaId', '==', id))
                )

                await deleteDoc(doc(db, 'turmas', id))

                await Swal.fire({
                    icon: 'success',
                    title: 'Sucesso',
                    text: 'A turma foi apagada com sucesso',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: 1500,
                })

                navigate('/painel')
            }
        } catch (err) {
            console.error(err.message)
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível apagar a turma',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500,
            })

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-10">
            <h2 className="text-center text-3xl mb-5">{turma?.serie} {turma?.turma} - {turma?.materia}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
                <Link className="flex items-center justify-center gap-2 border border-blue-700 p-1 transition delay-150 hover:bg-gray-900" to={`/nova-atividade/${id}`}>
                    <FilePlus
                        className="d-none d-md-block"
                        size={16} color="#20bf6b" />
                    Nova atividade
                </Link>

                <Link className="flex items-center justify-center gap-2 border border-blue-700 p-1 transition delay-150 hover:bg-gray-900" to={`/novo-aluno/${id}`}>
                    <UserPlus
                        className="d-none d-md-block"
                        size={16} color="#8854d0" />
                    Novo aluno
                </Link>

                {userData.nivel === '2' || !userData.nivel && <Link className="flex items-center justify-center gap-2 border border-blue-700 p-1 transition delay-150 hover:bg-gray-900" to={`/frequencia/${id}`}>
                    <FileUser
                        className="d-none d-md-block"
                        size={16} color="#fa8231" />
                    Fazer chamada
                </Link>}

                <Link className="flex items-center justify-center gap-2 border border-blue-700 p-1 transition delay-150 hover:bg-gray-900" to={`/atividades-recebidas-turma/${id}`}>

                    <File
                        className="d-none d-md-block"
                        size={16} color="#c0392b" />
                    Atividades Recebidas
                </Link>
            </div>

            <div className="mt-5 flex justify-evenly">
                <Link
                    to={`/atualizar-turma/${id}`}
                    className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"><FileCheck2 size={16} />Editar Turma</Link>

                {
                    loading ?
                        <button
                            onClick={handleDelete}
                            disabled
                            className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-gray-700 font-bold">
                            <Trash size={16} />
                            Apagar Turma</button>
                        :
                        <button
                            onClick={handleDelete}
                            className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-orange-700 transition delay-150 ease-in-out hover:bg-orange-900 font-bold">
                            <Trash size={16} />
                            Apagar Turma</button>
                }
            </div>


            <h3 className="my-10 text-center text-2xl">Atividades desta turma</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2" >
                {atividades.length > 0 ? atividades.map(atividade => (
                    <Link
                        className="border border-blue-700 hover:bg-gray-900"
                        to={`/atividade/${atividade?.id}`}>
                        <div
                            className="p-2 overflow-x-hidden"
                            key={atividade?.id}>
                            <p>{atividade?.nome} </p>

                        </div>
                    </Link>
                )) : <p className="text-center text-xl">Você ainda não criou nenhuma atividade</p>}
            </div>

            <h3 className="my-5">Alunos desta turma</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {alunos.length > 0 ? alunos.map(aluno => (
                    <div
                        className="border border-blue-700 p-2 hover:bg-gray-900 cursor-pointer"
                        key={aluno.id}>
                        <div className="">
                                <Link
                                    className="nav-link"
                                    to={`/aluno/${aluno.id}`}>
                            <p className="">Nome: {aluno.nome}</p>
                            </Link>
                        </div>
                    </div>
                )) : <p className="text-center text-xl">Você ainda não adicionou nenhum aluno a esta turma</p>}
            </div>
        </div>
    )
}