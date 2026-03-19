import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { Link } from "react-router-dom"

export const AcessoAluno = () => {

    const [codigo, setCodigo] = useState('')
    const [instituicao, setInstituicao] = useState([])

    useEffect(() => {

        if (codigo === '') {
            setInstituicao([])
            return
        }

        const fetchInstituicao = async () => {

            const instituicaoRef = query(
                collection(db, 'instituicoes'),
                where('codigo', '>=', codigo.toUpperCase()),
                where('codigo', '<=', codigo.toLocaleUpperCase() + '\uf8ff'),

            )

            const snapshot = await getDocs(instituicaoRef)

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setInstituicao(data)
        }

        fetchInstituicao()

    }, [codigo])

    return (
        <div className="container mt-5 bg-light p-lg-5 rounded">

            <h2 className="text-center mb-5">Selecione a sua instituição</h2>

            <div className="p-0 p-md-5 border rounded shadow mb-2">

                <input
                    type="text"
                    placeholder="Ex: UNIESP"
                    className="form-control mb-3"
                    value={codigo}
                    name="codigo"
                    onChange={e => setCodigo(e.target.value)}
                />

            </div>

            {
                instituicao.length === 0 ?
                    <p className="text-center">Se não encontrou a sua instituição ou não sabe o código entre em contato com a coordenação do seu curso</p>
                    :
                    <p className="text-center mt-3 h3">Selecione a sua instituição</p>

            }

            {
                instituicao.map(i => (
                    <Link
                        className="nav-link rounded mt-2 p-2 distack-secondary"
                        to={`/${i.codigo}`}
                        key={i.id}>{i.codigo} - {i.instituicao}</Link>
                ))
            }

        </div>
    )
}