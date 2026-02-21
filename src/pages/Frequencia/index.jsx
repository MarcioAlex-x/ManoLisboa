import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import { UserContext } from "../../contexts/UserContext"

export const Frequencia = () => {
    const [presencas, setPresencas] = useState({})
    const [alunos, setAlunos] = useState([])

    const { id } = useParams()
    const { userData } = useContext(UserContext)

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
        alert('Frequência salva')
    }

    return (
        <div className="container mt-lg-5 m-sm-0 bg-light min-h-100 p-sm-0 p-lg-5 rounded">
            <h2 className="my-5 text-center">Frequência </h2>
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