import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import Swal from "sweetalert2"

export const AtualizarTurma = () => {
    const [turmaData, setTurmaData] = useState(null)
    const [serie, setSerie] = useState('')
    const [turma, setTurma] = useState('')
    const [materia, setMateria] = useState('')

    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTurma = async () => {
            try {
                const turmaRef = doc(db, 'turmas', id)
                const turmaSnaphot = await getDoc(turmaRef)
                const data = turmaSnaphot.data()
                setTurmaData(data)

                setSerie(data?.serie || '')
                setTurma(data?.turma || '')
                setMateria(data?.materia || '')

            } catch (err) {
                console.error(err.message)
            }
        }
        fetchTurma()
    }, [id])

    const handleUpdate = async (e) => {

        e.preventDefault()

        try {
            const turmaRef = doc(db, 'turmas', id)
            await updateDoc(turmaRef, {
                serie,
                turma,
                materia
            })

            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Turma atualizada com sucesso',
                timer: 1500,
                timerProgressBar: '500'
            })

            navigate('/turmas')

        } catch (err) {

            console.error(err.message)

            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Houve um erro ao tentar atualizar a turma',
                timer: 1500,
                timerProgressBar: '500'
            })
        }
    }

    return (
        <div className="container bg-light my-5 rounded min-h-100">

            <h2 className="mt-5 text-center pt-2 pt-lg-5 rounded">Editar a Turma {turmaData?.serie}º {turmaData?.turma}</h2>

            <form
                className="px-2 px-lg-5 py-lg-5 rounded border shadow "
                onSubmit={handleUpdate}>

                <div className="form-container">
                    <label
                        htmlFor="serie"
                        className="form-label">Série</label>
                    <input
                        type="text"
                        className="form-control"
                        name="serie"
                        value={serie}
                        onChange={e => setSerie(e.target.value)} />
                </div>

                <div className="form-container">
                    <label
                        htmlFor="turma"
                        className="form-label">Turma</label>
                    <input
                        type="text"
                        className="form-control"
                        name="turma"
                        value={turma}
                        onChange={e => setTurma(e.target.value)} />
                </div>

                <div className="form-container">
                    <label
                        htmlFor="materia"
                        className="form-label">Matéria</label>
                    <input
                        type="text"
                        className="form-control"
                        name="materia"
                        value={materia}
                        onChange={e => setMateria(e.target.value)} />
                </div>

                <input
                    className="btn btn-success btn-sm w-100 mt-2"
                    type="submit"
                    value="Atualizar" />
            </form>
        </div>
    )
}