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

        <div className="">

            <form
                className=""
                onSubmit={handleUpdate}
            >

                <h2 className="text-center text-3xl mt-10">Editar usuário</h2>

                <div className="flex flex-col">
                    <label className="font-semibold">Instituição</label>

                    <select
                        className="border p-2 outline-0"
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

                <div className="flex flex-col mt-4">
                    <label className="font-semibold">Nome</label>

                    <input
                        type="text"
                        className="border p-2 outline-0"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                    />
                </div>

                <div className="flex flex-col mt-4">
                    <label className="font-semibold">Tipo</label>

                    <select
                        className="border p-2 outline-0 bg-gray-800"
                        value={tipo}
                        onChange={e => setTipo(e.target.value)}
                    >
                        <option value="admin">Admin</option>
                        <option value="professor">Professor</option>
                    </select>
                </div>

                <div className="flex flex-col mt-4">
                    <label className="font-semibold">Ativo até</label>

                    <input
                        type="date"
                        className="border p-2 outline-0"
                        value={ativoAte || ''}
                        onChange={e => setAtivoAte(e.target.value)}
                    />
                </div>

                <div className="flex mt-4">
                    <label className="font-semibold me-2">Ativo</label>

                    <input
                        type="checkbox"
                        checked={ativo}
                        onChange={e => setAtivo(e.target.checked)}
                    />
                </div>

                <input
                    className="mt-4 cursor-pointer mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                    type="submit"
                    value="Atualizar"
                />

            </form>

        </div>
    )
}