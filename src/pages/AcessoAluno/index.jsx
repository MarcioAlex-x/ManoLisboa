import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { Link } from "react-router-dom"


export const AcessoAluno = () => {

    const [atividades, setAtividades] = useState([])
    const [instituicoes, setInstituicoes] = useState([])
    const [instituicaoId, setInstituicaoId] = useState('')

    useEffect(() => {
        const fetchInstituicoes = async () => {
            try {

                const instituicoesRef = collection(db, 'instituicoes')
                const instituicoesSnapshot = await getDocs(instituicoesRef)
                const instituicoesData = instituicoesSnapshot.docs.map(doc => (
                    { id: doc.id, ...doc.data() }
                ))

                setInstituicoes(instituicoesData)

            } catch (err) {
                console.error(err.message)
            }
        }
        fetchInstituicoes()
    }, [])

    useEffect(() => {
        const fetchAtividades = async () => {
            const atividadesRef = query(collection(db, 'atividades'), where('instituicaoId', '==', instituicaoId))
            const atividadesSnapshot = await getDocs(atividadesRef)
            const atividadesData = atividadesSnapshot.docs.map(doc => (
                { id: doc.id, ...doc.data() }
            ))
            setAtividades(atividadesData)
        }
        fetchAtividades()
    }, [instituicaoId])

    return (
        <div className="container mt-5 bg-light p-5 rounded">
            <h2 className="text-center mb-5">Atividades</h2>
            <select
                className="form-control mb-5"
                name="instituicao"
                value={instituicaoId}
                onChange={e => setInstituicaoId(e.target.value)} >

                <option value="">Selecione a instituição</option>

                {instituicoes.map(data => (
                    <option key={data.id} value={data.id}>{data.instituicao}</option>
                ))}
            </select>

            <div className=" row g-4">
                {atividades.map(data => {
                    const hoje = new Date()
                    hoje.setHours(0, 0, 0, 0)
                    const entrega = new Date(data.dataEntrega)
                    entrega.setHours(0, 0, 0, 0)
                    if (entrega.getTime() >= hoje.getTime()) {
                        return (
                            <div className="d-flex">
                                <div
                                className="border p-5 border shadow rounded col-12 col-md-6"
                                key={data.id}>
                                    <h3>{data.nome}</h3>
                                    {
                                        data.conteudo &&
                                        <p style={{ whiteSpace: 'pre-wrap' }} >
                                            <b className="fs-5">Descricao:</b>
                                            <br />
                                            {data.conteudo}
                                        </p>
                                    }
                                    {data.orientacoes &&
                                        <p style={{ whiteSpace: 'pre-wrap' }}>
                                            <b className="fs-5">Orientações: </b>
                                            <br />
                                            {data.orientacoes}
                                        </p>
                                    }
                                    {data.dataEntrega && <p> <b className="fs-5">Entrgar até: </b> {new Date(data.dataEntrega).toLocaleDateString('pt-BR')}</p>}
                                    <Link className="btn btn-primary btn-sm" to={`/entrega-atividade/${data.id}`}>Entregar</Link>
                                </div>
                            </div>
                        )
                    }
                    return null
                })}
            </div>

        </div>
    )
}
