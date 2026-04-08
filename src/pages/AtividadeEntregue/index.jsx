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
        <div className="mt-10">

            {
                atividade?.titulo ?
                    <h2 className="text-center text-3xl">{atividade?.titulo}</h2>
                    :
                    atividade?.aluno ?
                        <h2 className="text-center text-3xl">Atividade de {atividade?.aluno}</h2>
                        :
                        <h2 className="text-center text-3xl">Atividade Sem Título</h2>
            }

            {
                atividade?.aluno &&
                <p className="text-center text-xl mt-5"><b>Aluno: </b>{atividade?.aluno}</p>
            }

            {
                atividade?.turma &&
                <p className="text-center"><b>Turma: </b>{atividade?.turma}</p>
            }

            {
                atividade?.link &&
                <p className="border border-blue-700 p-2 mt-2"><b>Link: </b><a href={atividade?.link}>Acessar</a></p>
            }

            {
                atividade?.texto &&

                <div className="border border-blue-700 p-2 mt-2">
                    <h5 className="text-2xl mb-5">Texto:</h5>
                    <p
                        style={{ whiteSpace: 'pre-wrap' }}>{atividade?.texto}</p>
                </div>
            }

            <p className="border border-blue-700 p-2 mt-2"><i>Entregue em {atividade?.entregueEm.toDate().toLocaleDateString('pt-BR')}</i></p>
            {
                loading ?
                    <button
                        onClick={handleDelete}
                        disabled
                        className="btn btn-sm btn-danger w-100">Aguarde</button>
                    :
                    <button
                        onClick={handleDelete}
                        className="cursor-pointer bg-orange-700 inline-block px-3 py-1 mt-2 transition delay-75 hover:bg-orange-800 font-semibold">Remover Entrega</button>
            }

        </div>
    )
}