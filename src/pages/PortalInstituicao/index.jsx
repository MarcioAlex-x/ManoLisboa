import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { ArrowBigRightDash } from "lucide-react"

export const PortalInstituicao = () => {

    const [instituicao, setInstituicao] = useState(null)
    const [professores, setProfessores] = useState([])
    const { codigo } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const instituicaoRef = query(collection(db, 'instituicoes'),
                where('codigo', '==', codigo)
            )
            const instituicaoSnapshot = await getDocs(instituicaoRef)
            const instituicaoData = instituicaoSnapshot.docs.map((doc) => (
                { id: doc.id, ...doc.data() }
            ))
            // ------------------------------------------------------------
            const professoresRef = query(collection(db, 'usuarios'),
                where('instituicaoId', '==', instituicaoData[0].id)
            )
            const professoresSnapshot = await getDocs(professoresRef)
            const professoresData = professoresSnapshot.docs.map((doc) => (
                { id: doc.id, ...doc.data() }
            ))
            // -------------------------------------------------------------

            setProfessores(professoresData)
            setInstituicao(instituicaoData[0])
        }

        fetchData()

    }, [codigo])
    return (
        <div className="container mt-5 bg-light p-lg-5 rounded">
            <h1 className="text-center mb-0">{instituicao?.instituicao}</h1>
            {professores.length === 0 ?
            <p className="text-center mb-5">Nenhum professor encontrado nesta instituição</p>
            :
            <p className="text-center mb-5">Selecione o seu professor para acessar os conteúdos e atividades</p>    
        }

            <div className="row">
                {
                    professores.map(prof => (
                        prof.ativo &&
                        <div
                            key={prof.id}
                            className=" col-12 col-sm-6 col-md-4 p-2">
                            <Link
                                className="nav-link border rounded shadow px-2 px-md-4 py-2 scale distack "
                                to={`/turmas-do-professor/${prof.id}`}>
                                    <p className="mb-0">Prof.</p>
                                <h5 className="d-flex align-items-center justify-content-between">
                                    {prof.nome} <ArrowBigRightDash />
                                </h5>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}