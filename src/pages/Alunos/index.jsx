import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import { Link } from "react-router-dom"
import { ArrowBigRightDash } from "lucide-react"

export const Alunos = () =>{
    const [alunos, setAlunos] = useState([])
    const { userData } = useContext(UserContext)
    
    useEffect(()=>{
        const fetchAlunos = async() =>{
            if(!userData) return

            const alunosRef = query(collection(db,'alunos'), where('professorId', '==',userData.uid), orderBy('nome','asc'))
            const alunosSnapshot = await getDocs(alunosRef)
            const alunosData = alunosSnapshot.docs.map(aluno=>(
                {id:aluno.id,...aluno.data()}
            ))

            setAlunos(alunosData)
        }
        fetchAlunos()
    },[userData])

    return(
        <div className="container my-5 bg-light p-1 p-lg-5">
            <h2 className="text-center mt-5 mb-0">Todos os Alunos</h2>
            <p className="text-center mb-5">Aqui são listadas todas os alunos que você cadastrou independente da turma
                <br />
                Para acessar os alunos por turma acesse <b>Todas as Turmas</b> e escolha a turma desejada
            </p>
            {alunos.map(aluno=>(
                <div 
                key={aluno.id}
                className="border my-2 py-2 px-1 p-lg-x shadow-sm rounded d-flex justify-content-between align-items-center scale">
                    <p className="m-0">Nome: {aluno.nome}</p>
                    <p className="m-0">
                        <Link
                        className="nav-link" 
                        to={`/aluno/${aluno.id}`}>Ver <ArrowBigRightDash /> </Link>
                        </p>
                </div>
            ))}
        </div>
    )
}