import { deleteDoc, doc, getDoc } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { FileArchive, FileCheck2, Link2, Trash } from "lucide-react"
import Swal from "sweetalert2"
import { UserContext } from '../../contexts/UserContext'

export const Atividade = () => {
    const [atividade, setAtividade] = useState(null)
    const [turma, setTurma] = useState(null)
    const { id } = useParams()
    const { userData } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {

                const atividadeRef = doc(db, 'atividades', id)
                const atividadeSnapshot = await getDoc(atividadeRef)
                const atividadeData = atividadeSnapshot.data()
                setAtividade(atividadeData)

                const turmaAtividadeRef = doc(db,'turmas',atividadeData.turmaId)
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
        <div className="container bg-light p-lg-5 my-5">
            {atividade?.nome ? <h2 className="mt-5 mb-0 text-center">{atividade?.nome}</h2> : <h2>Atividade sem nome</h2>}
            <h3 className="text-center mb-5 text-body-tertiary">Turma {turma?.serie}º {turma?.turma}</h3>

            {atividade?.peso !== null || atividade?.peso !== "" &&
                <div>
                    <p><b className="fs-5">Peso:</b> {atividade?.peso}</p>
                    <hr />
                </div>
            }

            {atividade?.conteudo &&
                <div>
                    <p style={{ whiteSpace: 'pre-wrap' }}><b className="fs-5">Conteúdo:</b>
                        <br />
                        {atividade?.conteudo}</p>
                    <hr />
                </div>
            }

            {atividade?.orientacoes &&
                <div>
                    <p style={{ whiteSpace: 'pre-wrap' }}><b className="fs-5">Orientações:</b>
                        <br />
                        {atividade?.orientacoes}</p>
                    <hr />
                </div>
            }

            {atividade?.link &&
                <div>
                    <p>
                        <b className="fs-5">Link do material: </b>
                        <a target="_blank" noopener noreferer href={atividade?.link}><Link2 /></a>
                    </p>
                    <hr />
                </div>
            }

            {atividade?.arquivoUrl &&
    <div>
        <p>
            <b className="fs-5">Arquivo da atividade: </b>
            <a
                href={atividade.arquivoUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
            >
                <FileArchive  /> Baixar PDF
            </a>
        </p>
        <hr />
    </div>
}

            {userData &&
                <div>
                    <p><b className="fs-5">Token: </b> {atividade?.token}</p>
                    <hr />
                </div>
            }
            {atividade?.dataEntrega &&
                <p><b>Data de entrega: </b>
                    {new Date(atividade?.dataEntrega).toLocaleDateString('pt-BR')}
                </p>
            }
            <br />

            {userData ?
                <div className="d-flex justify-content-around">
                    <button
                        className="btn btn-danger d-flex align-items-center"
                        onClick={handleDelete} > <Trash size={16}/> Excluir</button>

                    <Link 
                    className="btn btn-success d-flex align-items-center"
                    to={`/atualizar-atividade/${id}`} > <FileCheck2 size={16}/> Atualizar</Link>
                </div>
                :
                <Link to={`/entrega-atividade/${atividade?.id}`}
                    className="btn btn-success d-block w-100 fw-bold"> Entregar</Link>
            }

        </div>
    )
}