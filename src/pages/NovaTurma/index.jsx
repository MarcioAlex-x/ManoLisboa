import { useContext, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import Swal from "sweetalert2"

export const NovaTurma = () => {
    const [serie, setSerie] = useState('')
    const [turma, setTurma] = useState('')
    const [materia, setMateria] = useState('')

    const { userData } = useContext(UserContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addDoc(collection(db, 'turmas'), {
                serie,
                turma,
                materia,
                professorId:userData.uid
            })
            Swal.fire({
                title:'Sucesso',
                text:'Turma criada com sucesso',
                icon:'success',
                showCancelButton:false,
                timerProgressBar:1500,
                timer:1500
            })
            setSerie('')
            setTurma('')
            setMateria('')
        } catch (err) {
            console.error(err.message)
            Swal.fire({
                title:'Erro',
                text:'Ocorreu um erro ao tentar criar a nova turma',
                icon:'error',
                showCancelButton:false,
                timerProgressBar:1500,
                timer:1500                
            })
        }
    }

    return (
        <div className="bg-dar">
            <div className="container mt-4 bg-light p-5">
                <h2 className="text-center">Nova Turma</h2>
            
                <form onSubmit={handleSubmit} className="mt-5 p-5 border rounded shadow">
                    <div>
                        <label htmlFor="serie" className="form-label">Série ou Ano</label>
                        <input
                            placeholder="Preencha apenas com números"
                            className="form-control"
                            type="text"
                            name="serie"
                            value={serie}
                            onChange={e => setSerie(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="turma" className="form-label">Turma</label>
                        <input
                            placeholder="Informe a turma"
                            className="form-control"
                            type="text"
                            name="turma"
                            value={turma}
                            onChange={e => setTurma(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="turma" className="form-label">Materia</label>
                        <input
                            placeholder="Informe a matéria que será ministrada"
                            className="form-control"
                            type="text"
                            name="materia"
                            value={materia}
                            onChange={e => setMateria(e.target.value)} />
                    </div>
                    <input
                        className="btn btn-primary mt-4 d-block w-100 fw-bold"
                        type="submit"
                        value="Salvar" />
                </form>
            </div>
        </div>
    )
}