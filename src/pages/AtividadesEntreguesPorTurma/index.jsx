import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"

export const AtividadesEntreguesPorTurma = () => {
    const [atividades, setAtividades] = useState([])

    const { id } = useParams()

    useEffect(() => {
        const fetchAtividades = async () => {
            const atividadesRef = query(collection(db, 'entregas'), where('turmaId', '==', id))
            const atividadesSnapshot = await getDocs(atividadesRef)
            const atividadesData = atividadesSnapshot.docs.map((doc) => ({
                id: doc.id, ...doc.data()
            }))
            setAtividades(atividadesData)
        }
        fetchAtividades()
    }, [id])

    return (
        <div className="">
            <h2 className="mt-10 text-center text-3xl">Todas as atividades recebidas desta turma</h2>
            <p className="text-center"><i>{atividades.length} atividades</i></p>
            {atividades.length === 0 && <p className="text-center">Não há atividades recebidas até aqui</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-10">
                {atividades.map((atividade) => (
                    <div
                        className="border border-blue-700 p-2 flex flex-col justify-between transition delay-150 ease-in-out hover:bg-gray-900"
                        key={atividade.id}>

                        <h4 className="font-bold text-center text-xl">{atividade.titulo}</h4>
                        <p className=""><b>Aluno:</b> {atividade.aluno}</p>
                        <p><b>Turma: </b>{atividade.turma}</p>
                        <Link
                            to={`/atividade-recebida/${atividade.id}`}
                            className="cursor-pointer mt-2 mx-auto flex items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold w-full">Acessar</Link>

                    </div>
                ))}
            </div>
        </div>
    )
}