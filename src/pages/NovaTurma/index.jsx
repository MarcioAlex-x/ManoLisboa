import { useContext, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import Swal from "sweetalert2"

export const NovaTurma = () => {
    const [serie, setSerie] = useState('')
    const [turma, setTurma] = useState('')
    const [materia, setMateria] = useState('')
    const [loading, setLoading] = useState(false)

    const { userData } = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await addDoc(collection(db, 'turmas'), {
                serie,
                turma,
                materia,
                professorId: userData.uid
            })
            Swal.fire({
                title: 'Sucesso',
                text: 'Turma criada com sucesso',
                icon: 'success',
                showCancelButton: false,
                timerProgressBar: 1500,
                timer: 1500
            })
            setSerie('')
            setTurma('')
            setMateria('')
        } catch (err) {
            console.error(err.message)
            Swal.fire({
                title: 'Erro',
                text: 'Ocorreu um erro ao tentar criar a nova turma',
                icon: 'error',
                showCancelButton: false,
                timerProgressBar: 1500,
                timer: 1500
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="">
            <div className="mt-10">
                <h2 className="text-center text-3xl">Nova Turma</h2>
                <p className="text-center">Crie a sua nova turma preenchendo os campos abaixo e comfirmando no botão salvar</p>

                <form
                className="mt-10" 
                onSubmit={handleSubmit}>
                    
                    <div  className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex flex-col">
                            <label
                                htmlFor="serie"
                                className="font-bold">Série ou Ano</label>
                            <input
                                placeholder=""
                                className="border outline-0 p-1"
                                type="text"
                                name="serie"
                                value={serie}
                                onChange={e => setSerie(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label
                                htmlFor="turma"
                                className="font-bold">Turma</label>
                            <input
                                placeholder=""
                                className="border outline-0 p-1"
                                type="text"
                                name="turma"
                                value={turma}
                                onChange={e => setTurma(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label
                            htmlFor="turma"
                            className="font-bold">Materia</label>
                            <input
                                placeholder=""
                                className="border outline-0 p-1"
                                type="text"
                                name="materia"
                                value={materia}
                                onChange={e => setMateria(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex">
                        {!loading ?
                            <input
                                className=" font-semibold mt-5 mx-auto p-1 w-3/12 md:w-2/12 bg-green-700 transition delay-150 ease-in-out hover:bg-green-800 cursor-pointer"
                                type="submit"
                                value="Salvar" />
                            :
                            <input
                                className=""
                                disabled
                                data-bs-toggle="button"
                                type="submit"
                                value="Salvar" />}
                    </div>
                </form>
            </div>
        </div>
    )
}