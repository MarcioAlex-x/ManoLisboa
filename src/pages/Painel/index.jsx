import { useContext, useEffect, useState } from "react"
import { UserContext } from '../../contexts/UserContext'
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../../firebaseConfig"
import { Link } from "react-router-dom"
import { ArrowBigRightDash, AtSign, FilePenLine, Users } from "lucide-react"

export const Painel = () => {

    const { userData } = useContext(UserContext)
    const [atividades, setAtividades] = useState([])
    const [turmas, setTurmas] = useState([])
    const [usuarios, setUsuarios] = useState([])

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

                const usuariosRef = await getDocs(collection(db, 'usuarios'))
                const usuariosSnapshot = usuariosRef.docs.map(doc => (
                    { id: doc.id, ...doc.data() }
                ))

                setUsuarios(usuariosSnapshot)
                setAtividades(atividades)
                setTurmas(turmas)
                
            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()

    }, [userData?.uid])

    return (
        <div className="container bg-light my-5 p-sm-0 p-lg-5 rounded" style={{ height: '100vh' }}>
            <h2 className="mb-5 text-center">Painel de {userData.nome}</h2>
            <div className="border shadow p-2 p-lg-4 rounded ">
                <p className="m-0"> <AtSign size={16} color="#3867d6" /> {userData.email}</p>
                {atividades.length == 0 ?
                    (<p className="m-0">Nenhuma atividade cadastrada.</p>)
                    :
                    (
                        (
                            atividades.length < 2 ?
                                (<p className="m-0"><FilePenLine size={16} color="#8854d0" /> {atividades.length} atividade cadastrada.</p>)
                                :
                                (<p className="m-0"><FilePenLine size={16} color="#8854d0" /> {atividades.length} atividades cadastradas.</p>)
                        )
                    )
                }


                {turmas.length == 0 ?
                    (<p>Nenhuma turma cadastrada.</p>)
                    :
                    (
                        (
                            turmas.length < 2 ?
                                (<p className="m-0"> <Users size={16} color="#20bf6b" /> {turmas.length} turma cadastrada.</p>)
                                :
                                (<p className="m-0"> <Users size={16} color="#20bf6b" /> {turmas.length} turmas cadastradas.</p>)
                        )
                    )
                }
            </div>

            <div>
                <h2 className="mt-5 text-center mb-0">Atividades ativas</h2>
                <p className="text-center mb-4">As atividades ativas são aquelas que a data de entrega ainda <i>não expiraram</i></p>
                {atividades.map(atividade => (
                    new Date(atividade.dataEntrega).toLocaleDateString('pt-BR') > new Date().toLocaleDateString('pt-BR') &&
                    <div className="border py-1 py-lg-2 px-lg-4 px-2 rounded shadow-sm mb-2 scale d-flex justify-content-between">
                        <p
                            className="m-0 "
                            key={atividade.id}>
                            {atividade.nome}
                        </p>
                        <Link
                            className="nav-link"
                            to={`/atividade/${atividade.id}`}>Acessar atividade <ArrowBigRightDash />
                        </Link>
                    </div>
                ))}
            </div>
            <div>

                <h2 className="mt-5 text-center mb-0">Atividades inativas</h2>
                 <p className="text-center mb-4">As atividades inativas são aquelas que a data de entrega <b>já expiraram</b>
                    <br />
                    Você também pode apagar caso queira manter a área limpa acessando a atividade e clicando no botão <b>apagar</b>
                 </p>
                {atividades.map(atividade => (
                    new Date(atividade.dataEntrega).toLocaleDateString('pt-BR') < new Date().toLocaleDateString('pt-BR') &&
                    <div className="border py-lg-2 py-1 px-lg-4 px-2 rounded shadow-sm mb-2 scale d-flex justify-content-between">
                        <p
                            className="m-0 "
                            key={atividade.id}>
                            {atividade.nome}
                        </p>
                        <Link
                            className="nav-link"
                            to={`/atividade/${atividade.id}`}>Acessar atividade <ArrowBigRightDash />
                        </Link>
                    </div>
                ))}
            </div>
            {
                userData.tipo == 'admin' &&
                <div className="my-5">
                    <h2 className="text-center mt-5">Dados do Administrador</h2>
                    <p><b>Usuários cadastrados:</b> {usuarios.length}</p>
                    <table className="table border shadow">
                        <thead>
                            <tr>
                                <th >Nome</th>
                                <th>Tipo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(usuario => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.tipo}</td>
                                    <td>
                                        <Link
                                        to={`/usuario/${usuario.id}`}
                                        className="nav-link">Acessar</Link>
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