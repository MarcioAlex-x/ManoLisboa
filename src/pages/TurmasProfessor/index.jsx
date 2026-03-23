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
        <div className="container bg-light my-5 p-lg-5 p-0">
            <h2 className="my-4 text-center">Turmas do Professor</h2>
            {
                turmas.length === 0 ?
                    <p>Nenhuma turma encontrada</p> :
                    <div className="">
                        {turmas.map(t=>(
                            <div key={t.id}>
                                
                                <Link 
                                className="nav-link border p-2 d-flex align-items-center distack mb-2"
                                to={`/atividades-do-professor/${t.id}`}> <Users className="me-2"/> {t.serie} - {t.turma}</Link>
                            </div>
                        ))}
                    </div>
            }
        </div>
    )
}