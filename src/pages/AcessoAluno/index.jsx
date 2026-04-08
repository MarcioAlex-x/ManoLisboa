import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { Link } from "react-router-dom"
import { Building2 } from "lucide-react"

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
        <div className=" w-10/12 m-auto" >

            <h2 className="text-center mb-8 font-bold text-3xl">Selecione a sua instituição</h2>

            <div className="w-8/12 m-auto">

                <input
                    type="text"
                    placeholder="Ex: UNIESP"
                    className="border w-12/12 outline-hidden mb-4"
                    value={codigo}
                    name="codigo"
                    onChange={e => setCodigo(e.target.value)}
                />

            </div>

            {
                instituicao.length === 0 ?
                    <p className="text-center text-lg">Se não encontrou a sua instituição ou não sabe o código, entre em contato com a coordenação do seu curso</p>
                    :
                    <p className="text-center text-lg">Selecione a sua instituição</p>

            }

            {
                instituicao.map(i => (
                    <Link
                        className=""
                        to={`/${i.codigo}`}
                        key={i.id}>
                            
                        <p className="flex p-2 transition delay-75 duration-300 ease-in-out hover:bg-gray-900"> <Building2 className="mr-2" /> {i.codigo} - {i.instituicao}</p>
                    </Link>
                ))
            }

        </div>
    )
}