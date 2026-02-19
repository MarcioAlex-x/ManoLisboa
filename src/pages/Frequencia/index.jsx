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

    useEffect(()=>{
        const fetchData = async () =>{
            const alunosRef = query(collection(db, 'alunos'), where('turmaId','==',id), orderBy('nome','asc'))
            const alunosSnapshot = await getDocs(alunosRef)
            const alunos = alunosSnapshot.docs.map(aluno=>(
                {id:aluno.id,...aluno.data()}
            ))
            setAlunos(alunos)

            const inicial = {}
            alunos.forEach(a=>inicial[a.id] = false)
            setPresencas(inicial)
        }
        if(id) fetchData()
    },[id])

    const togglePresenca = (alunoId, checked) =>{
        setPresencas(prev=>({
            ...prev,
            [alunoId]:checked
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const promessas = alunos.map(aluno =>
            addDoc(collection(db,'frequencia'),{
                turmaId: id,
                alunoId: aluno.id,
                professorId:userData.uid,
                presenca: presencas[aluno.id] || false,
                data: serverTimestamp()
            })
        )

        await Promise.all(promessas)
        alert('Frequência salva')
    }

    return (
        <form onSubmit={handleSubmit}>
            {alunos.map(aluno=>(
                <div key={aluno.id}>
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

            <button type="submit">Salvar Frequência</button>
        </form>
    )
}