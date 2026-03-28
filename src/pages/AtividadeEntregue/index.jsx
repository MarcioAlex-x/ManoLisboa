import { deleteDoc, doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import Swal from "sweetalert2"

export const AtividadeEntregue = () => {

    const [atividade, setAtividade] = useState(null)
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const atividadeFetch = async () => {

            try {

                const atividadeRef = doc(db, 'entregas', id)
                const atividadeSnapshot = await getDoc(atividadeRef)

                if (atividadeSnapshot.exists()) {

                    const entregaData = atividadeSnapshot.data()

                    setAtividade({
                        id: atividadeSnapshot.id,
                        ...entregaData
                    })
                }

            } catch (err) {
                console.error(err.messsage)
            }
        }



        atividadeFetch()

    }, [id])

    const handleDelete = async () => {

        setLoading(true)

        try {
            const atividadeRef = doc(db, 'entregas', id)
            await deleteDoc(atividadeRef)
            await Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'A entrega foi removida',
                timer: 1500,
                timerProgressBar: 1500,
                showConfirmButton: false
            })

        } catch (err) {
            console.error(err.message)

            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao tentar remover a entrega',
                timer: 1500,
                timerProgressBar: 1500,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container bg-light p-lg-5 my-5">

            {
                atividade?.titulo ?
                    <h2 className="my-5 text-center mb-0">{atividade?.titulo}</h2>
                    :
                    atividade?.aluno ?
                        <h2 className="my-5 text-center mb-0">Atividade de {atividade?.aluno}</h2>
                        :
                        <h2 className="my-5 text-center mb-0">Atividade Sem Título</h2>
            }

            <hr />

            {
                atividade?.aluno &&
                <p className="mb-0"><b>Aluno: </b>{atividade?.aluno}</p>
            }

            {
                atividade?.turma &&
                <p><b>Turma: </b>{atividade?.turma}</p>
            }

            {
                atividade?.link &&
                <p><b>Link: </b><a href={atividade?.link}>Acessar</a></p>
            }

            {
                atividade?.texto &&

                <div>
                    <h5 className="mb-0">Texto:</h5>
                    <p
                        className="p-2"
                        style={{ whiteSpace: 'pre-wrap' }}>{atividade?.texto}</p>
                </div>
            }

            <p><i>Entregue em {atividade?.entregueEm.toDate().toLocaleDateString('pt-BR')}</i></p>
            {
                loading ?
                    <button
                        onClick={handleDelete}
                        disabled
                        className="btn btn-sm btn-danger w-100">Aguarde</button>
                    :
                    <button
                        onClick={handleDelete}
                        className="btn btn-sm btn-danger w-100">Remover Entrega</button>
            }

        </div>
    )
}