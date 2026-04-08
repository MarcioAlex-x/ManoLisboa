import { useContext, useEffect, useState } from "react"
import { UserContext } from '../../contexts/UserContext'
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import { Link } from "react-router-dom"
import { ArrowBigRightDash, AtSign, Calendar, File, FilePenLine, Users } from "lucide-react"

export const Painel = () => {

    const { userData } = useContext(UserContext)
    const [atividades, setAtividades] = useState([])
    const [turmas, setTurmas] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [entregas, setEntregas] = useState([])

    useEffect(() => {
        const fetchData = async () => {

            try {
                if (!userData?.uid) return
                const qa = query(collection(db, 'atividades'), where('professorId', '==', userData.uid), orderBy('criadoEm', 'desc'))
                const snapshotAtividades = await getDocs(qa)
                const atividades = snapshotAtividades.docs.map(atividade => ({
                    id: atividade.id, ...atividade.data()
                }))

                const qt = query(collection(db, 'turmas'), where('professorId', '==', userData.uid))
                const snapshotTurmas = await getDocs(qt)
                const turmas = snapshotTurmas.docs.map(turmas => ({
                    id: turmas.id, ...turmas.data()
                }))

                const qe = query(collection(db, 'entregas'), where('professorId', '==', userData.uid))
                const snapshotEntregas = await getDocs(qe)
                const entregas = snapshotEntregas.docs.map(entrega => ({
                    id: entrega.id, ...entrega.data()
                }))

                const usuariosRef = await getDocs(collection(db, 'usuarios'))
                const usuariosSnapshot = usuariosRef.docs.map(doc => (
                    { id: doc.id, ...doc.data() }
                ))

                setUsuarios(usuariosSnapshot)
                setAtividades(atividades)
                setTurmas(turmas)
                setEntregas(entregas)

            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()

    }, [userData?.uid])

    return (
        <div className="" style={{ height: '100vh' }}>
            <h2 className="text-center text-3xl mt-10">Painel de {userData.nome}</h2>
            <div className="p-2 md:flex justify-around">
                <div>
                    <p className="flex items-center gap-1"> <AtSign size={16} color="#3867d6" /> {userData.email}</p>
                    {atividades.length == 0 ?
                        (<p className="flex items-center gap-1">Nenhuma atividade cadastrada.</p>)
                        :
                        (
                            (
                                atividades.length < 2 ?
                                    (<p className="flex items-center gap-1"><FilePenLine size={16} color="#8854d0" /> {atividades.length} atividade cadastrada.</p>)
                                    :
                                    (<p className="flex items-center gap-1"><FilePenLine size={16} color="#8854d0" /> {atividades.length} atividades cadastradas.</p>)
                            )
                        )
                    }
                </div>


                <div>
                    {turmas.length == 0 ?
                        (<p>Nenhuma turma cadastrada.</p>)
                        :
                        (
                            (
                                turmas.length < 2 ?
                                    (<p className="flex items-center gap-1"> <Users size={16} color="#20bf6b" /> {turmas.length} turma cadastrada.</p>)
                                    :
                                    (<p className="flex items-center gap-1"> <Users size={16} color="#20bf6b" /> {turmas.length} turmas cadastradas.</p>)
                            )
                        )
                    }
                    {entregas.length == 0 ?
                        (<p>Nenhuma atividade entregue.</p>)
                        :
                        (
                            (
                                entregas.length < 2 ?
                                    (<p className="flex items-center gap-1"> <Users size={16} color="#20bf6b" /> {entregas.length} atividade entregue.</p>)
                                    :
                                    (<p className="flex items-center gap-1"> <File size={16} color="#d31d81" /> {entregas.length} atividades entregues.</p>)
                            )
                        )
                    }
                </div>
            </div>

            <div className="">
                <p className="flex items-center gap-1 justify-center "> <Calendar size={16} className="" /> O seu acesso expira em {userData?.ativoAte.toDate().toLocaleDateString('pt-BR')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-10">
                <div className="border border-blue-600 p-2">
                    <h2 className="text-2xl text-center">Atividades ativas</h2>
                    {/* <p className="">As atividades ativas são aquelas que a data de entrega ainda <i>não expiraram</i></p> */}
                    {atividades.map(atividade => (
                        new Date(atividade.dataEntrega).toLocaleDateString('pt-BR') > new Date().toLocaleDateString('pt-BR') &&
                        <Link
                            className="flex hover:bg-gray-900"
                            to={`/atividade/${atividade.id}`}>
                            <p
                                className=" "
                                key={atividade.id}>
                                {atividade.nome}
                            </p>
                        </Link>
                    ))}
                </div>
                <div className="border border-blue-600 p-2">
                    <h2 className="text-2xl text-center">Atividades expiradas</h2>
                    {/* <p className="">As atividades inativas são aquelas que a data de entrega <b>já expiraram</b>
                        <br />
                        Você também pode apagar caso queira manter a área limpa acessando a atividade e clicando no botão <b>apagar</b>
                     </p> */}
                    {atividades.map(atividade => (
                        new Date(atividade.dataEntrega).toLocaleDateString('pt-BR') < new Date().toLocaleDateString('pt-BR') &&

                            <Link
                                className="flex hover:bg-gray-900"
                                to={`/atividade/${atividade.id}`}>
                                <p
                                    className=""
                                    key={atividade.id}>
                                    {atividade.nome}
                                </p>
                            </Link>
                    ))}
                </div>
            </div>
            {
                userData.tipo == 'admin' &&
                <div className="my-10">
                    <h2 className="text-center text-3xl">Dados do Administrador</h2>
                    <p className="text-center"><b>Usuários cadastrados:</b> {usuarios.length}</p>

                    <table className="my-10 w-12/12 border border-blue-700">
                        <thead className="">
                            <tr className="">
                                <th className="bg-gray-500 p-2 text-start">Nome</th>
                                <th className="bg-gray-500 p-2 text-start">Tipo</th>
                                <th className="bg-gray-500 p-2 text-start">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {usuarios.map(usuario => (
                                <tr key={usuario.id} className="border-b">
                                    <td className="p-1 ">{usuario.nome}</td>
                                    <td>{usuario.tipo}</td>
                                    <td>
                                        <Link
                                            to={`/usuario/${usuario.id}`}
                                            className="">Acessar</Link>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            }


        </div>
    )
}