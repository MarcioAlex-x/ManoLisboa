import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"

export const AtividadesEntreguesPorTurma = () =>{
    const [atividades, setAtividades] = useState([])
    
    const { id } = useParams()

    useEffect(()=>{
        const fetchAtividades = async () =>{
            const atividadesRef = query(collection(db,'entregas'),where('turmaId','==',id))
            const atividadesSnapshot = await getDocs(atividadesRef)
            const atividadesData = atividadesSnapshot.docs.map((doc)=>({
                id:doc.id, ...doc.data()
            }))
            setAtividades(atividadesData)
        }
        fetchAtividades()
    },[id])

    return(
        <div className="container bg-light p-lg-5 my-5">
            <h2 className="my-5 text-center">Todas as Atividades Recebidas da Turma</h2>
            <p className="text-center"><i>Esta turma entregou {atividades.length} atividades</i></p>
            {atividades.length === 0 && <p className="text-center">Não há atividades recebidas até aqui</p> }
            <div className="row">
                {atividades.map((atividade)=>(
                    <div
                    className="col-12 col-lg-4 d-flex my-1"
                    key={atividade.id}>

                        <div 
                        style={{height:'320px'}}
                        className=" p-3 border rounded d-flex flex-column position-relative w-100">
                            <h4 className="mb-0">{atividade.titulo}</h4>
                            <hr className="mb-0"/>
                            <p className="mb-0"><b>Aluno:</b> {atividade.aluno}</p>
                            <p><b>Turma: </b>{atividade.turma}</p>
                            <Link 
                            to={`/atividade-recebida/${atividade.id}`}
                            className="btn btn-primary btn-sm position-absolute bottom-0 start-50 translate-middle w-50">Acessar</Link>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}