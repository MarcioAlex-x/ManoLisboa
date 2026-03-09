import { doc, getDoc, updateDoc, collection, getDocs, Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import Swal from "sweetalert2"

export const AtualizarUsuario = () => {

    const { id } = useParams()

    const [loading, setLoading] = useState(true)

    const [nome, setNome] = useState('')
    const [tipo, setTipo] = useState('')
    const [instituicaoId, setInstituicaoId] = useState('')
    const [instituicoes, setInstituicoes] = useState([])
    const [ativo, setAtivo] = useState(false)
    const [ativoAte, setAtivoAte] = useState('')

    useEffect(() => {

        const fetchData = async () => {

            try {

                const usuarioRef = doc(db, 'usuarios', id)
                const usuarioSnap = await getDoc(usuarioRef)

                if (!usuarioSnap.exists()) {
                    Swal.fire({
                        icon: "error",
                        title: "Erro",
                        text: "Usuário não encontrado"
                    })
                    return
                }

                const data = usuarioSnap.data()

                setNome(data.nome || '')
                setTipo(data.tipo || '')
                setInstituicaoId(data.instituicaoId || '')
                setAtivo(data.ativo || false)

                if (data.ativoAte) {
                    const dataConvertida = data.ativoAte.toDate().toISOString().split('T')[0]
                    setAtivoAte(dataConvertida)
                }

                const instituicoesRef = collection(db, "instituicoes")
                const instSnap = await getDocs(instituicoesRef)

                const lista = instSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))

                setInstituicoes(lista)

            } catch (err) {

                console.error(err)

                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: "Erro ao carregar dados do usuário"
                })

            } finally {
                setLoading(false)
            }
        }

        fetchData()

    }, [id])


    const handleUpdate = async (e) => {

        e.preventDefault()

        try {

            const usuarioRef = doc(db, "usuarios", id)

            const dataExpira = ativo && ativoAte
                ? Timestamp.fromDate(new Date(ativoAte))
                : null

            await updateDoc(usuarioRef, {
                nome,
                tipo,
                instituicaoId,
                ativo,
                ativoAte: dataExpira
            })

            Swal.fire({
                icon: "success",
                title: "Sucesso",
                text: "Usuário atualizado com sucesso",
                timer: 1500,
                showConfirmButton: false
            })

        } catch (err) {

            console.error(err)

            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "Não foi possível atualizar o usuário"
            })
        }
    }


    if (loading) {
        return <p className="text-center mt-5">Carregando...</p>
    }

    return (

        <div className="container bg-light my-5 p-lg-5 p-0">

            <form
                className="py-lg-5 px-lg-5 py-5 px-2 border rounded shadow"
                onSubmit={handleUpdate}
            >

                <h2 className="text-center mb-4">Editar usuário</h2>

                <div>
                    <label className="form-label">Instituição</label>

                    <select
                        className="form-control"
                        value={instituicaoId}
                        onChange={e => setInstituicaoId(e.target.value)}
                    >

                        <option value="">Selecione</option>

                        {instituicoes.map(inst => (
                            <option key={inst.id} value={inst.id}>
                                {inst.instituicao}
                            </option>
                        ))}

                    </select>
                </div>

                <div className="mt-3">
                    <label className="form-label">Nome</label>

                    <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                    />
                </div>

                <div className="mt-3">
                    <label className="form-label">Tipo</label>

                    <select
                        className="form-control"
                        value={tipo}
                        onChange={e => setTipo(e.target.value)}
                    >
                        <option value="admin">Admin</option>
                        <option value="professor">Professor</option>
                    </select>
                </div>

                <div className="mt-3">
                    <label className="form-label me-2">Ativo</label>

                    <input
                        type="checkbox"
                        checked={ativo}
                        onChange={e => setAtivo(e.target.checked)}
                    />
                </div>

                <div className="mt-3">
                    <label className="form-label">Ativo até</label>

                    <input
                        type="date"
                        className="form-control"
                        value={ativoAte || ''}
                        onChange={e => setAtivoAte(e.target.value)}
                    />
                </div>

                <input
                    className="btn btn-primary w-100 mt-4"
                    type="submit"
                    value="Atualizar"
                />

            </form>

        </div>
    )
}