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
        <div className="mt-10">

            <h2 className="text-center text-3xl">Editar a Turma {turmaData?.serie}º {turmaData?.turma}</h2>

            <form
                className=""
                onSubmit={handleUpdate}>

                <div className="flex flex-col mt-4">
                    <label
                        htmlFor="serie"
                        className="font-semibold">Série</label>
                    <input
                        type="text"
                        className="border p-2 outline-0"
                        name="serie"
                        value={serie}
                        onChange={e => setSerie(e.target.value)} />
                </div>

                <div className="flex flex-col mt-4">
                    <label
                        htmlFor="turma"
                        className="font-semibold">Turma</label>
                    <input
                        type="text"
                        className="border p-2 outline-0"
                        name="turma"
                        value={turma}
                        onChange={e => setTurma(e.target.value)} />
                </div>

                <div className="flex flex-col mt-4">
                    <label
                        htmlFor="materia"
                        className="font-semibold">Matéria</label>
                    <input
                        type="text"
                        className="border p-2 outline-0"
                        name="materia"
                        value={materia}
                        onChange={e => setMateria(e.target.value)} />
                </div>

                <input
                    className="mt-4 cursor-pointer mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                    type="submit"
                    value="Atualizar" />
            </form>
        </div>
    )
}