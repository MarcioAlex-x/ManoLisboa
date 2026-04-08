import { collection, getDocs, query, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { UserContext } from "../../contexts/UserContext"
import { Link } from "react-router-dom"

export const AtividadesEntregues = () => {
    const [atividades, setAtividades] = useState([])
    const { userData } = useContext(UserContext)

    useEffect(() => {
        const atividadesFetch = async () => {
            try {
                const atividadesRef = query(collection(db, 'entregas'), where('professorId', '==', userData.uid))
                const atividadesSnapshot = await getDocs(atividadesRef)
                const atividadesData = atividadesSnapshot.docs.map((doc) => (
                    { id: doc.id, ...doc.data() }
                ))
                setAtividades(atividadesData)

            } catch (err) {
                console.error(err.message)
            }
        }
        atividadesFetch()
    }, [userData])

    return (
        <div className="mt-10">
            <h2 className="text-center text-3xl">Todas as Atividades Recebidas</h2>
            {atividades.length === 0 && <p className="text-center text-3xl">Não há atividades recebidas até aqui</p>}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-2">
                {atividades.map((atividade) => (
                    <div
                        className="border border-blue-700 p-2"
                        key={atividade.id}>

                        <div className="">
                            {
                                atividade.titulo ?
                                    <h4 className="font-semibold">{atividade.titulo}</h4>
                                    :
                                    <h4 className="font-semibold">Atividade de {atividade.aluno}</h4>
                            }
                            <p className=""><b>Aluno:</b> {atividade.aluno}</p>
                            <p><b>Turma: </b>{atividade.turma}</p>
                            <Link
                                to={`/atividade-recebida/${atividade.id}`}
                                className="bg-green-700 inline-block px-3 py-1 mt-2 transition delay-75 hover:bg-green-800 font-semibold">Acessar</Link>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}