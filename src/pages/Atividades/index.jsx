
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
        <div className='mt-10'>
            <h2 className='text-center text-3xl'>Todas as Atividades</h2>
            <p className='text-center mb-5'>Aqui são listadas todas as atividades cadastradas independete da turma
                <br />
                Para acessar as atividades por turma acesse <b>Todas as Tumas</b> e escolha a turma desejada
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                {atividades.map(atividade => (
                    <div
                        className='border border-blue-700 p-2 overflow-hidden'
                        key={atividade.id}>

                        <div className="">
                            {atividade.nome ? <h2 className='font-semibold'>{atividade.nome}</h2> : <h2 className='font-semibold'>Atividade sem nome</h2>}
                            <div className=''>
                                <p><b>Token: </b>{atividade.token}</p>
                                <Link className='bg-green-700 inline-block px-3 py-1 mt-2 transition delay-75 hover:bg-green-800 font-semibold' to={`/atividade/${atividade.id}`}>Acessar</Link>
                                <p>Criado em: {atividade.criadoEm.toDate().toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}