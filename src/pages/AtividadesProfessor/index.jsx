import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { File } from "lucide-react"

export const AtividadesProfessor = () => {

    const { id } = useParams()

    const [atividades, setAtividades] = useState([])


    useEffect(() => {

        const fectchData = async () => {
            const atividadesRef = query(collection(db, 'atividades'),
                where('turmaId', '==', id))
            const atividadesSnapshot = await getDocs(atividadesRef)
            const atividadesData = atividadesSnapshot.docs.map((doc) => (
                { id: doc.id, ...doc.data() }
            ))
            setAtividades(atividadesData)
        }

        fectchData()

    }, [id])

    const hoje = new Date()

    const atividadesValidas = atividades.filter(atividade => {
        const dataEntrega = atividade.dataEntrega?.toDate
            ? atividade.dataEntrega.toDate()
            : new Date(atividade.dataEntrega)

        return dataEntrega > hoje
    })

    return (

        <div className="">
            <h2 className="text-3xl text-center leading-0 mt-10">Atividades da Turma</h2>
            {
                atividadesValidas.length === 0 ? (
                    <div>
                        <p className="text-center">
                            Não tem atividade atribuída a esta turma
                        </p>
                        <img
                        className="w-5/12 mx-auto my-10" 
                        src="/procurando.png" 
                        alt="" />
                    </div>
                ) : (
                    
                    <div>
                        <p className="text-center mt-5 mb-10">Selecione a atividade</p>
                        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {atividadesValidas.map(atividade => (
                                <Link
                                    to={`/atividade/${atividade.id}`}
                                    className="flex border p-1 transition delay-150 ease-in-out hover:bg-gray-900 overflow-x-hidden"
                                    key={atividade.id}
                                >
                                    <File className="mr-1 "/>
                                    <p className="h6 mb-0">{atividade.nome}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )
            }
        </div >
    )
}