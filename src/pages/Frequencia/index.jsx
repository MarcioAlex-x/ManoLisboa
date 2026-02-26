import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { UserContext } from "../../contexts/UserContext"
import Swal from "sweetalert2"
import { Info } from "lucide-react"

export const Frequencia = () => {
    const [presencas, setPresencas] = useState({})
    const [alunos, setAlunos] = useState([])

    const { id } = useParams()
    const { userData } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const alunosRef = query(collection(db, 'alunos'), where('turmaId', '==', id), orderBy('nome', 'asc'))
            const alunosSnapshot = await getDocs(alunosRef)
            const alunos = alunosSnapshot.docs.map(aluno => (
                { id: aluno.id, ...aluno.data() }
            ))
            setAlunos(alunos)

            const inicial = {}
            alunos.forEach(a => inicial[a.id] = false)
            setPresencas(inicial)
        }
        if (id) fetchData()
    }, [id])

    const togglePresenca = (alunoId, checked) => {
        setPresencas(prev => ({
            ...prev,
            [alunoId]: checked
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const promessas = alunos.map(aluno =>
            addDoc(collection(db, 'frequencia'), {
                turmaId: id,
                alunoId: aluno.id,
                professorId: userData.uid,
                presenca: presencas[aluno.id] || false,
                data: serverTimestamp()
            })
        )

        await Promise.all(promessas)

        let confirm = await Swal.fire({
            icon: 'question',
            title: 'Deseja fazer a chamada da mesma turma outra vez?',
            showConfirmButton: true,
            showCancelButton: true
        })

        if (confirm.isConfirmed) {
            Swal.fire({
                icon: 'info',
                title: 'Nova frequência',
                text: 'Faça uma nova frequência com a turma para o dia de hoje',
            })
        }else{
            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'A frequência foi salva',
                timer: 1500,
                timerProgressBar: 1500
            })
            
            navigate(`/turma/${id}`)
        }

    }
//  min-h-100 
    return (
        <div className="container rounded p-0 p-lg-5 mt-5 bg-light">
            <h2 className="my-5 text-center">Frequência </h2>
            <p className="text-center border border-warning rounded d-flex align-items-center justify-content-center text-warning"> <Info size={16} className="me-2"/> Marque o aluno para atribuir presença ao aluno e deixe desmarcado para atribuir falta.</p>
            <form
                className="border rounded shadow p-5"
                onSubmit={handleSubmit}>
                {alunos.map(aluno => (

                    <div
                        className="border p-2 d-flex justify-content-between align-items-center mb-1 rounded"
                        key={aluno.id}>
                        {aluno.nome}
                        <input
                            className="border bg-danger"
                            type="checkbox"
                            checked={presencas[aluno.id] || false}
                            onChange={e =>
                                togglePresenca(aluno.id, e.target.checked)
                            }
                        />
                    </div>
                ))}
                <button
                    className="btn btn-primary btn-sm d-block w-100"
                    type="submit">Salvar Frequência</button>
            </form>
        </div>
    )
}