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

         Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'A frequência foi salva',
            showConfirmButton: false,
            timer: 1500
        })

        let confirm = await Swal.fire({
            icon: 'question',
            title: 'Deseja salvar outra frequência para o dia de hoje?',
            showConfirmButton: true,
            confirmButtonText: 'Salvar outra',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        })

        if (!confirm.isConfirmed) {
            navigate(`/turma/${id}`)
        }
    }

    return (
        <div className="">
            <h2 className="mt-10 text-center text-2xl">Frequência</h2>
            <p className="text-center">Os alunos marcados receberão presença</p>

            <form
                className="mt-5"
                onSubmit={handleSubmit}
            >

                <div className="mb-2">
                    <input
                        className="mr-2"
                        type="checkbox"
                        id="checkTodos"
                        checked={todosMarcados}
                        onChange={(e) => {
                            const checked = e.target.checked
                            setTodosMarcados(checked)
                            marcarTodos(checked)
                        }}
                    />
                    <label className="" htmlFor="checkTodos">
                        <i>Marcar todos como presentes</i>
                    </label>
                </div>

                {alunos.map(aluno => (
                    <div
                        className="border border-blue-700 p-1 mb-1 flex gap-2 transition delay-150 ease-in-out hover:bg-gray-900"
                        key={aluno.id}
                    >
                        <input
                        className="border border-blue-700"
                            type="checkbox"
                            checked={presencas[aluno.id] || false}
                            onChange={e =>
                                togglePresenca(aluno.id, e.target.checked)
                            }
                        />
                        {aluno.nome}

                    </div>
                ))}

                <button
                    className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </form>
        </div>
    )
}