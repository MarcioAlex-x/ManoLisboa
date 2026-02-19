import { collection, getDocs, query, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { UserContext } from "../../contexts/UserContext"
import { Link } from "react-router-dom"
import { ArrowBigRight } from 'lucide-react';

export const Turmas = () => {
    const { userData } = useContext(UserContext)
    const [turmas, setTurmas] = useState([])


    useEffect(() => {
        if (!userData?.uid) return

        const fetchData = async () => {
            const q = query(collection(db, 'turmas'), where('professorId', '==', userData.uid))
            const snapshot = await getDocs(q)
            const turmas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setTurmas(turmas)
        }
        fetchData()
        console.log(turmas)
    }, [userData])
    return (
        <div className="container bg-light min-vh-100 p-5 mt-5 rounded" >
            <h2 className="text-center mb-5">Todas as suas turmas</h2>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">Ano/Série</th>
                        <th scope="col">Turma</th>
                        <th scope="col">Matéria</th>
                        <th scope="col">Acessar</th>
                    </tr>
                </thead>
                <tbody>
                    {turmas.map((turma) => (
                        <tr key={turma.id} >
                        <th>{turma.serie}º</th> 
                        <th>{turma.turma.toUpperCase()} </th>
                        <th>{turma.materia}</th> 
                        <th>
                            <Link 
                                className="nav-link" 
                                to={`/turma/${turma.id}`}> 
                                    <ArrowBigRight className="scale"/>
                            </Link>
                        </th>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}