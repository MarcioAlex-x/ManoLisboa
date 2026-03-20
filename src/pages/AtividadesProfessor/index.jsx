import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"

export const AtividadesProfessor = () => {

    const { id } = useParams()
    const [professor, setProfessor] = useState(null)
    const [atividades, setAtividades] = useState([])

    useEffect(() => {

        const fectchData = async () => {

            const professorRef = doc(db, 'usuarios', id)
            const professorSnapshot = await getDoc(professorRef)
            setProfessor(professorSnapshot.data())
            // ----------------------------
            const atividadesRef = query(collection(db, 'atividades'),
                where('professorId', '==', id))
            const atividadesSnapshot = await getDocs(atividadesRef)
            const atividadesData = atividadesSnapshot.docs.map((doc) => (
                { id: doc.id, ...doc.data() }
            ))
            setAtividades(atividadesData)
        }

        fectchData()

    }, [id])

    const hoje = new Date()

    return (

        <div className="container bg-light my-5 p-lg-5 p-0">
            <h2 className="my-4 text-center">Atividades de {professor?.nome}</h2>
            {
                atividades.map(atividade => {
                    const dataEntrega = new Date(atividade.dataEntrega)
                    return (
                        dataEntrega >= hoje && (
                            <div key={atividade.id}>
                                <Link
                                    to={`/atividade/${atividade.id}`}
                                    className="h5 nav-link distack p-1">{atividade.nome}</Link>
                            </div>
                        )

                    )
                })
            }
        </div >
    )
}