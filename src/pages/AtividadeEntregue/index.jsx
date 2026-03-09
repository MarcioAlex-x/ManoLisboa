import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"

export const AtividadeEntregue = () =>{

    const [atividade, setAtividade] = useState(null)
    const { id } = useParams()

    useEffect(()=>{
        const atividadeFetch = async () =>{

            try {

                const atividadeRef = doc(db,'entregas',id)
                const atividadeSnapshot = await getDoc(atividadeRef)
                if(atividadeSnapshot.exists()){
                    setAtividade(atividadeSnapshot.data())
                }

            } catch (err) {
                console.error(err.messsage)
            }
        }
        
        atividadeFetch()

    },[id])

    return(
        <div className="container bg-light p-lg-5 my-5">
            <h2 className="my-5 text-center mb-0">{atividade?.titulo}</h2>
            <hr />
            {
                atividade?.aluno && 
                <p className="mb-0"><b>Aluno: </b>{atividade?.aluno}</p>
            }

            {
                atividade?.turma &&
                <p><b>Turma: </b>{atividade?.turma}</p>
            }

            {
                atividade?.link &&
                <p><b>Link: </b><a href={atividade?.link}>Acessar</a></p>
            }

            {
                atividade?.texto &&

                <div>
                    <h5 className="mb-0">Texto:</h5>
                    <p 
                    className="p-2"
                    style={{whiteSpace:'pre-wrap'}}>{atividade?.texto}</p>
                </div>
            }

            <p><i>Entregue em {atividade?.entregueEm.toDate().toLocaleDateString('pt-BR')}</i></p>
        </div>
    )
}