import { deleteDoc, doc, getDoc } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { FileArchive, FileCheck2, Link2, Trash } from "lucide-react"
import Swal from "sweetalert2"
import { UserContext } from '../../contexts/UserContext'
import Linkify from 'linkify-react'

export const Atividade = () => {
    const [atividade, setAtividade] = useState(null)
    const [turma, setTurma] = useState(null)

    const { userData } = useContext(UserContext)

    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {

                const atividadeRef = doc(db, 'atividades', id)
                const atividadeSnapshot = await getDoc(atividadeRef)
                const atividadeData = atividadeSnapshot.data()
                setAtividade(atividadeData)

                const turmaAtividadeRef = doc(db, 'turmas', atividadeData.turmaId)
                const turmaSnapshot = await getDoc(turmaAtividadeRef)
                setTurma(turmaSnapshot.data())

            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()

    }, [id])

    const handleDelete = async () => {
        if (!id) {
            Swal.fire({
                title: "Erro",
                text: "Não foi possível apagar a atividade selecionada",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            })
            return
        }

        const result = await Swal.fire({
            title: "Tem certeza?",
            text: "Essa ação não pode ser desfeita",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        })

        if (result.isConfirmed) {
            await deleteDoc(doc(db, "atividades", id))

            await Swal.fire({
                title: "Excluído",
                text: "A atividade foi removida",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            })

            navigate("/atividades")
        }
    }

    return (
        <div className="t">
            {atividade?.nome ?
                <h2 className="text-center mt-10 text-3xl ">{atividade?.nome}</h2>
                :
                <h2 className="text-center mt-10 text-3xl ">Atividade sem nome</h2>
            }
            <h3 className="text-center text-2xl mb-10">Turma {turma?.serie} {turma?.turma}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {atividade?.peso !== null || atividade?.peso !== "" &&
                    <div >
                        <p><b className="">Peso:</b> {atividade?.peso}</p>
                        
                    </div>
                }

                {atividade?.conteudo &&
                    <div className="border p-2 border-blue-400">
                        <p style={{ whiteSpace: 'pre-wrap' }}><b className="">Conteúdo:</b>
                            <br />
                            {atividade?.conteudo}</p>
                        
                    </div>
                }
                {atividade?.orientacoes &&
                    <Linkify tagName='div' className="border p-2 border-blue-400">
                        <p style={{ whiteSpace: 'pre-wrap' }}><b className="">Orientações:</b>
                            <br />
                            {atividade?.orientacoes}
                        </p>
                        
                    </Linkify>
                }
                {atividade?.link &&
                    <div className="border p-2 border-blue-400">
                        <p>
                            <b className="">Link do material: </b>
                            <a
                                className=""
                                target="_blank"
                                noopener
                                noreferer
                                href={atividade?.link}><Link2 /></a>
                        </p>
                        
                    </div>
                }
                {atividade?.arquivoUrl &&
                    <div className="border p-2 border-blue-400">
                        <p>
                            <b className="">Arquivo da atividade: </b>
                            <a
                                className=''
                                href={atividade.arquivoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                            >
                                <FileArchive /> Baixar PDF
                            </a>
                        </p>
                        
                    </div>
                }
                {userData &&
                    <div className="border p-2 border-blue-400">
                        <p><b className="fs-5">Token: </b> {atividade?.token}</p>
                        
                    </div>
                }
                {atividade?.dataEntrega &&
                    <p className="border p-2 border-blue-400"><b>Data de entrega: </b>
                        {new Date(atividade?.dataEntrega).toLocaleDateString('pt-BR')}
                    </p>
                }
                <br />
               
            </div>
             {userData ?
                    <div className=" flex justify-around">
                        <button
                        style={{cursor:'pointer'}}
                            className="flex w-2/12 items-center justify-center gap-1 p-2 bg-amber-700 transition delay-150 ease-in-out hover:bg-amber-900 font-bold"
                            onClick={handleDelete} > <Trash size={16} /> Excluir</button>
                        <Link
                            className="flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                            to={`/atualizar-atividade/${id}`} > <FileCheck2 size={16} /> Atualizar</Link>
                    </div>
                    :
                    !atividade?.paraLeitura && <Link to={`/entrega-atividade/${id}`}
                        className="mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"> Entregar</Link>
                }

        </div>
    )
}