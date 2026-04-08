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
        <div className="mt-10 " >
            <h2 className="text-center text-3xl ">Todas as suas turmas</h2>
            <table className="w-12/12 border border-blue-700 mt-5">
                <thead className="bg-gray-600">
                    <tr className="border-b-blue-700">
                        <th scope="col">Ano/Série</th>
                        <th scope="col">Turma</th>
                        <th scope="col">Matéria</th>
                        <th scope="col">Acessar</th>
                    </tr>
                </thead>
                <tbody className="">
                    {turmas.map((turma) => (
                        <tr key={turma.id} className=" hover:bg-gray-500">
                        <th className="p-1">{turma.serie}</th> 
                        <th className="p-1">{turma.turma.toUpperCase()} </th>
                        <th className="p-1">{turma.materia}</th> 
                        <th className="p-1">
                            <Link 
                                className="flex justify-center" 
                                to={`/turma/${turma.id}`}> 
                                    <ArrowBigRight className="text-center"/>
                            </Link>
                        </th>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}