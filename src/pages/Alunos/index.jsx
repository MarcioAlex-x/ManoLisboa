import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import { Link } from "react-router-dom"
import { ArrowBigRightDash } from "lucide-react"

export const Alunos = () => {
    const [alunos, setAlunos] = useState([])
    const { userData } = useContext(UserContext)

    useEffect(() => {
        const fetchAlunos = async () => {
            if (!userData) return

            const alunosRef = query(collection(db, 'alunos'), where('professorId', '==', userData.uid), orderBy('nome', 'asc'))
            const alunosSnapshot = await getDocs(alunosRef)
            const alunosData = alunosSnapshot.docs.map(aluno => (
                { id: aluno.id, ...aluno.data() }
            ))

            setAlunos(alunosData)
        }
        fetchAlunos()
    }, [userData])

    return (
        <div className="mt-10">
            <h2 className="text-center text-3xl">Todos os seus alunos</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-10">
            
                {alunos.map(aluno => (
                    <div
                        key={aluno.id}
                        className="flex flex-col border border-blue-700 overflow-hidden p-2 text-center h-full transition delay-150 ease-in-out hover:bg-gray-900"
                    >
                        <p>{aluno.nome}</p>
                        <div className="mt-auto">
                            <Link
                                className="bg-green-700 inline-block px-3 py-1 mt-2 transition delay-75 hover:bg-green-800 font-semibold"
                                to={`/aluno/${aluno.id}`}
                            >
                                Acessar
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}