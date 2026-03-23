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

        <div className="container bg-light my-5 p-lg-5 p-0">
            <h2 className="my-4 text-center">Atividades da Turma</h2>
            {
                atividadesValidas.length === 0 ? (
                    <p className="text-center">
                        Não tem atividade atribuída a esta turma
                    </p>
                ) : (
                    atividadesValidas.map(atividade => (
                        <Link
                            to={`/atividade/${atividade.id}`}
                            className="border px-2 rounded mb-0 d-flex align-items-center p-2 distack nav-link"
                            key={atividade.id}
                        >
                            <File />
                            <p className="h6 mb-0">{atividade.nome}</p>
                        </Link>
                    ))
                )
            }
        </div >
    )
}