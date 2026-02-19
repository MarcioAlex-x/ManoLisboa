import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { ArrowBigRightDash, FilePlus, FileUser, UserPlus } from "lucide-react"

export const Turma = () => {

    const [atividades, setAtividades] = useState([])
    const [alunos, setAlunos] = useState([])
    const [turma, setTurma] = useState(null)

    const { id } = useParams()

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

                const alunosRef = query(collection(db, 'alunos'), where('turmaId', '==', id))
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

    return (
        <div className="container mt-5 bg-light rounded p-lg-5 p-sm-2 min-vh-100">
            <h2 className="text-center mb-5">{turma?.serie}º {turma?.turma} - {turma?.materia}</h2>

            <hr />
            <div className="d-flex justify-content-around">
                <Link className="nav-link scale" to={`/nova-atividade/${id}`}>Nova atividade<FilePlus size={16} color="#20bf6b" /></Link>
                <Link className="nav-link scale" to={`/novo-aluno/${id}`}>Novo aluno<UserPlus size={16} color="#8854d0" /></Link>
                <Link className="nav-link scale" to={`/frequencia/${id}`}>Fazer chamada<FileUser size={16} color="#fa8231" /></Link>
            </div>
            <hr />


            <h3 className="my-5">Atividades desta turma</h3>
            <div className="border p-3">
                {atividades.length > 0 ? atividades.map(atividade => (
                    <div
                        className="border py-2 px-4 my-2 shadow-sm d-flex justify-content-between scale bg-light"
                        key={atividade?.id}>
                        <p>{atividade?.nome} </p>
                        <Link
                            className="nav-link"
                            to={`/atividade/${atividade?.id}`}>
                            Ir para atividade<ArrowBigRightDash color="#20bf6b"/>
                        </Link>
                    </div>
                )) : <p>Você ainda não criou nenhuma atividade</p>}
            </div>

            <h3 className="my-5">Alunos desta turma</h3>
            {alunos.length > 0 ? alunos.map(aluno => (
                <div
                className="" 
                key={aluno.id}>
                    <div className="d-flex justify-content-between border my-2 scale px-4 py-2 bg-light">
                        <p className="m-0">Nome: {aluno.nome} - Chave de acesso: {aluno.chave}</p> 
                        <p className="m-0">
                            <Link 
                            className="nav-link"
                            to={`/aluno/${aluno.id}`}>Ver Aluno <ArrowBigRightDash color="#2d98da"/> </Link>
                            </p>
                    </div>
                </div>
            )) : <p>Você ainda não adicionou nenhum aluno a esta turma</p>}
        </div>
    )
}