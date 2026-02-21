
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { useContext, useEffect, useState } from "react"
import { UserContext } from '../../contexts/UserContext'
import { Link } from 'react-router-dom'

export const Atividades = () => {
    const { userData } = useContext(UserContext)
    const [atividades, setAtividades] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!userData?.uid) return
                const q = query(collection(db, 'atividades'), where('professorId', '==', userData.uid), orderBy('criadoEm', 'desc'))
                const snapshot = await getDocs(q)
                const atividades = snapshot.docs.map(atividade => ({
                    id: atividade.id, ...atividade.data()
                }))
                setAtividades(atividades)
            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()
    }, [userData?.uid])

    return (
        <div className='container bg-light p-2 p-lg-5'>
            <h2 className='my-5 text-center'>Todas as Atividades</h2>
            <div className="row g-2">
                {atividades.map(atividade => (
                    <div
                        className='col-12 col-md-6 col-lg-4 d-flex scale'
                        key={atividade.id}>

                        <div className="border rounded shadow p-3 w-100 d-flex flex-column">
                            {atividade.nome ? <h2>{atividade.nome}</h2> : <h2>Atividade sem nome</h2>}
                            <div className='mt-auto'>
                                <p><b>Token: </b>{atividade.token}</p>
                                <Link className='btn btn-sm btn-outline-primary w-25' to={`/atividade/${atividade.id}`}>Acessar</Link>
                                <p>Criado em: {atividade.criadoEm.toDate().toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}