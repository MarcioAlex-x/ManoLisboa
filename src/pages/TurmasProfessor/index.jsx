import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { Link, useParams } from "react-router-dom"
import { Group, Users } from "lucide-react"

export const TurmasProfessor = () => {

    const [turmas, setTurmas] = useState([])
    const { id } = useParams()


    useEffect(() => {
        const fetchData = async () => {
            const turmasRef = query(collection(db, 'turmas')
                , where('professorId', '==', id))
            const turmasSnapshot = await getDocs(turmasRef)
            const turmasData = turmasSnapshot.docs.map(doc => (
                { id: doc.id, ...doc.data() }
            ))
            setTurmas(turmasData)
        }
        fetchData()
    }, [id])

    return (
        <div className="mt-10">
            <h2 className="text-center text-3xl mt-10 mb-5">Turmas do Professor</h2>
            {
                turmas.length === 0 ?
                    <div>
                        <p className="text-center">Nenhuma turma encontrada</p>
                        <img
                            className="w-5/12 mx-auto my-10"
                            src="/procurando.png"
                            alt="" />
                    </div> :
                    <div>
                        <p className="text-center mb-10">Selecione a sua turma</p>
                        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
                            {turmas.map(t => (
                                <div key={t.id}>

                                    <Link
                                        className="flex border p-1 transition delay-150 ease-in-out duration-300 hover:bg-gray-950 "
                                        to={`/atividades-do-professor/${t.id}`}> <Users className="me-2" /> {t.serie} - {t.turma}</Link>
                                </div>
                            ))}
                        </div>
                    </div>
            }
        </div>
    )
}