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
        <div className="">
            <h1 className="text-center mb-2 mt-10 leading-0">
                <span className="text-xl">Você está acessando</span>
                <br />
                <span className="text-2xl">{instituicao?.instituicao}</span>
            </h1>
            {professores.length === 0 ?
                <p className="text-center mb-5">Nenhum professor encontrado nesta instituição</p>
                :
                <p className="text-center mb-5">Selecione o seu professor para acessar os conteúdos e atividades</p>
            }

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-10">
                {
                    professores.map(prof => (
                        prof.ativo &&
                        <div
                            key={prof.id}
                            className="border p-2 transition delay-100 duration-300 ease-in-out hover:bg-gray-950">
                            <Link
                                className="flex"
                                to={`/turmas-do-professor/${prof.id}`}>
                                {/* <p className="mb-0">Prof.</p> */}
                                <h5 className="flex justify-between w-12/12 ">
                                    <span>Prof. {prof.nome}</span> <ArrowBigRightDash className="" />
                                </h5>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}