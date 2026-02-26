import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"

export const Usuario = () => {
    const [usuario, setUsuario] = useState(null)
    const [instituicao, setInsituicao] = useState(null)
    const [alunos, setAlunos] = useState([])
    const [turmas, setTurmas] = useState([])

    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usuarioRef = doc(db, 'usuarios', id)
                const usuarioSnapshot = await getDoc(usuarioRef)
                const usuarioData = {
                    id: usuarioSnapshot.id, ...usuarioSnapshot.data()
                }

                const instituicaoRef = doc(db, 'instituicoes', usuarioData.instituicaoId)
                const instituicaoSnapshot = await getDoc(instituicaoRef)
                const instiuicaoData = {
                    id: instituicaoSnapshot.id, ...instituicaoSnapshot.data()
                }
                console.log(instiuicaoData)

                const alunosRef = query(collection(db, 'alunos'), where('professorId', '==', id))
                const alunosSnapshot = await getDocs(alunosRef)
                const alunosData = alunosSnapshot.docs.map(doc => ({
                    id: doc.id, ...doc.data()
                }))

                const turmasRef = query(collection(db, 'turmas'), where('professorId', '==', id))
                const turmasSnapshot = await getDocs(turmasRef)
                const turmasData = turmasSnapshot.docs.map(doc => ({
                    id: doc.id, ...doc.data()
                }))

                setTurmas(turmasData)
                setAlunos(alunosData)
                setUsuario(usuarioData)
                setInsituicao(instiuicaoData)

            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()
    }, [id])

    return (
        <div className="container mt-5 bg-light p-lg-5 rounded ">
            <div className="p-2 border rounded p-4 shadow">
                <h2 className="text-center my-5">Informações do Usuário</h2>
                <h3>Nome: <span className="text-secondary">{usuario?.nome}</span></h3>
                <h3>Instituição: <span className="text-secondary">{instituicao?.instituicao}</span></h3>
                <p>{turmas.length} turma(s)</p>
                <p>{alunos.length} aluno(s)</p>
            </div>
            <div className="border rounded p-4 mt-4 shadow ">
                <h2>Turmas</h2>
                {turmas.length > 0 ?
                    turmas.map(turma => (
                        <div className="d-flex flex-wrap">
                            <p
                                className="border rounded shadow p-3 m-2 "
                                key={turma.id}>{turma.serie}º {turma.turma}</p>
                        </div>
                    )) :
                    <p>Ainda não tem turmas cadastradas</p>
                }

                <h2 className="mt-4">Alunos</h2>
                {alunos.length > 0 ? alunos.map(aluno => (
                    <div
                        key={aluno.id}
                        className="d-flex flex-wrap">
                        <p className="p-2 border rounded shadow">{aluno.nome}</p>
                    </div>
                )) :
                    <p>Ainda não tem alunos cadastrados</p>
                }
            </div>
        </div>
    )
}