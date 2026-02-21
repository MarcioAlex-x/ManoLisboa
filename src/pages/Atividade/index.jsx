import { deleteDoc, doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import Linkify from 'linkify-react'
import { Link } from "lucide-react"
import Swal from "sweetalert2"

export const Atividade = () => {
    const [atividade, setAtividade] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {

                const atividadeRef = doc(db, 'atividades', id)
                const atividadeSnapshot = await getDoc(atividadeRef)
                setAtividade(atividadeSnapshot.data())

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
            {atividade?.nome ? <h2 className="my-5 text-center">{atividade?.nome}</h2> : <h2>Atividade sem nome</h2>}

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
                    <p><b className="fs-5">Link do material: </b><a target="_blank" noopener noreferer href={atividade?.link}><Link /></a></p>
                    <hr />
                </div>
            }

            <p><b className="fs-5">Token: </b> {atividade?.token}</p>
            <hr />
            {atividade?.dataEntrega &&
                <p><b>Data de entrega: </b>
                    {new Date(atividade?.dataEntrega).toLocaleDateString('pt-BR')}
                </p>
            }
            <br />


            <button
                className="btn btn-danger d-block w-100 fw-bold"
                onClick={handleDelete} >Excluir</button>
        </div>
    )
}