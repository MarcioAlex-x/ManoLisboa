import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { UserContext } from "../../contexts/UserContext"
import Swal from "sweetalert2"

export const Frequencia = () => {
    const [presencas, setPresencas] = useState({})
    const [alunos, setAlunos] = useState([])
    const [loading, setLoading] = useState(false)
    const [todosMarcados, setTodosMarcados] = useState(false)

    const { id } = useParams()
    const { userData } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const alunosRef = query(
                collection(db, 'alunos'),
                where('turmaId', '==', id),
                orderBy('nome', 'asc')
            )

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

    const marcarTodos = (checked) => {
        const novos = {}

        alunos.forEach(aluno => {
            novos[aluno.id] = checked
        })

        setPresencas(novos)
    }

    useEffect(() => {
        if (alunos.length === 0) return

        const todosTrue = alunos.every(aluno => presencas[aluno.id])
        setTodosMarcados(todosTrue)

    }, [presencas, alunos])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

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
        setLoading(false)

        let confirm = await Swal.fire({
            icon: 'question',
            title: 'Deseja salvar outra frequência para o dia de hoje?',
            showConfirmButton: true,
            confirmButtonText: 'Salvar outra',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        })

        Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'A frequência foi salva',
            showConfirmButton: false,
            timer: 1500
        })

        if (!confirm.isConfirmed) {
            navigate(`/turma/${id}`)
        }
    }

    return (
        <div className="container rounded p-0 p-lg-5 mt-5 bg-light">
            <h2 className="my-4 text-center">Frequência</h2>

            <form
                className="border rounded shadow p-5"
                onSubmit={handleSubmit}
            >

                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="checkTodos"
                        checked={todosMarcados}
                        onChange={(e) => {
                            const checked = e.target.checked
                            setTodosMarcados(checked)
                            marcarTodos(checked)
                        }}
                    />
                    <label className="form-check-label" htmlFor="checkTodos">
                        Marcar todos como presentes
                    </label>
                </div>

                {alunos.map(aluno => (
                    <div
                        className="border p-2 d-flex justify-content-between align-items-center mb-1 rounded"
                        key={aluno.id}
                    >
                        {aluno.nome}

                        <input
                            type="checkbox"
                            checked={presencas[aluno.id] || false}
                            onChange={e =>
                                togglePresenca(aluno.id, e.target.checked)
                            }
                        />
                    </div>
                ))}

                <button
                    className="btn btn-primary btn-sm d-block w-100 mt-3"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : 'Salvar Frequência'}
                </button>
            </form>
        </div>
    )
}