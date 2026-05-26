import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { db, storage } from "../../firebaseConfig"
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes
} from "firebase/storage"

import Swal from "sweetalert2"

export const AtualizarAtividade = () => {

    const [atividade, setAtividade] = useState(null)

    const [nome, setNome] = useState('')
    const [orientacoes, setOrientacoes] = useState('')
    const [conteudo, setConteudo] = useState('')
    const [peso, setPeso] = useState('')
    const [link, setLink] = useState('')
    const [dataEntrega, setDataEntrega] = useState('')
    const [arquivo, setArquivo] = useState(null)

    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    const { id } = useParams()

    useEffect(() => {

        const fetchData = async () => {

            try {

                const atividadeRef = doc(db, 'atividades', id)

                const atividadeSnapshot = await getDoc(atividadeRef)

                if (!atividadeSnapshot.exists()) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Erro',
                        text: 'Atividade não encontrada'
                    })

                    return
                }

                const atividadeData = atividadeSnapshot.data()

                setAtividade(atividadeData)

                setNome(atividadeData.nome || '')
                setOrientacoes(atividadeData.orientacoes || '')
                setConteudo(atividadeData.conteudo || '')
                setPeso(atividadeData.peso || '')
                setLink(atividadeData.link || '')

                const dataFormatada =
                    atividadeData.dataEntrega
                        ?.toDate?.()
                        ?.toISOString()
                        ?.split('T')[0]

                setDataEntrega(dataFormatada || '')

            } catch (err) {

                console.error(err)

                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao carregar atividade'
                })

            } finally {

                setLoading(false)

            }

        }

        fetchData()

    }, [id])

    const handleUpdate = async (e) => {

        e.preventDefault()

        if (updating) return

        try {

            setUpdating(true)

            const atividadeRef = doc(db, 'atividades', id)

            let arquivoUrl = atividade?.arquivoUrl || null
            let arquivoPath = atividade?.arquivoPath || null

            if (arquivo) {

                if (arquivo.type !== 'application/pdf') {

                    Swal.fire({
                        icon: 'error',
                        title: 'Arquivo inválido',
                        text: 'Envie apenas arquivos PDF'
                    })

                    return
                }

                if (arquivoPath) {

                    const oldRef = ref(storage, arquivoPath)

                    await deleteObject(oldRef).catch(() => { })

                }

                const novoRef = ref(
                    storage,
                    `atividades-do-professor/${atividade.professorId}/${Date.now()}_${arquivo.name}`
                )

                await uploadBytes(novoRef, arquivo)

                arquivoUrl = await getDownloadURL(novoRef)

                arquivoPath = novoRef.fullPath
            }

            await updateDoc(atividadeRef, {
                nome,
                orientacoes,
                conteudo,
                peso,
                link,
                dataEntrega,
                arquivoUrl,
                arquivoPath
            })

            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Atividade atualizada com sucesso',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
            })

        } catch (err) {

            console.error(err)

            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao atualizar atividade',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            })

        } finally {

            setUpdating(false)

        }

    }

    if (loading) {
        return <span className="loader"></span>
    }

    return (
        <div>

            <h2 className="text-center text-3xl mt-10">
                Atualizar Atividade
            </h2>

            {nome && (
                <h3 className="text-center">
                    <i>{nome}</i>
                </h3>
            )}

            <form
                onSubmit={handleUpdate}
            >

                <div className="flex flex-col">

                    <label
                        className="font-semibold"
                        htmlFor="nome"
                    >
                        Nome da atividade
                    </label>

                    <input
                        className="border p-2 outline-0 mt-2"
                        type="text"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                    />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">

                    <div className="flex flex-col">

                        <label
                            className="font-semibold"
                            htmlFor="orientacoes"
                        >
                            Orientações
                        </label>

                        <textarea
                            style={{ resize: 'none' }}
                            className="border p-2 outline-0 mt-2"
                            rows={10}
                            name="orientacoes"
                            value={orientacoes}
                            onChange={e => setOrientacoes(e.target.value)}
                        />

                    </div>

                    <div className="flex flex-col">

                        <label
                            className="font-semibold"
                            htmlFor="conteudo"
                        >
                            Conteúdo
                        </label>

                        <textarea
                            style={{ resize: 'none' }}
                            rows={10}
                            className="border p-2 outline-0 mt-2"
                            name="conteudo"
                            value={conteudo}
                            onChange={e => setConteudo(e.target.value)}
                        />

                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                    <div className="flex flex-col mt-4">

                        <label
                            className="font-semibold"
                            htmlFor="peso"
                        >
                            Peso
                        </label>

                        <input
                            className="border p-2 outline-0 mt-2"
                            type="text"
                            name="peso"
                            value={peso}
                            onChange={e => setPeso(e.target.value)}
                        />

                    </div>

                    <div className="flex flex-col mt-4">

                        <label
                            className="font-semibold"
                            htmlFor="dataEntrega"
                        >
                            Data de entrega
                        </label>

                        <input
                            className="border p-2 outline-0 mt-2"
                            type="date"
                            name="dataEntrega"
                            value={dataEntrega}
                            onChange={e => setDataEntrega(e.target.value)}
                        />

                    </div>

                    <div className="flex flex-col mt-4">

                        <label
                            className="font-semibold"
                            htmlFor="link"
                        >
                            Link
                        </label>

                        <input
                            className="border p-2 outline-0 mt-2"
                            type="text"
                            name="link"
                            value={link}
                            onChange={e => setLink(e.target.value)}
                        />

                    </div>

                    <div className="flex flex-col mt-4">

                        <label
                            className="font-semibold"
                            htmlFor="arquivo"
                        >
                            Arquivo PDF
                        </label>

                        <input
                            className="border p-2 outline-0 mt-2"
                            type="file"
                            accept="application/pdf"
                            onChange={e => setArquivo(e.target.files[0])}
                        />

                    </div>

                </div>

                <input
                    className="mt-4 cursor-pointer mx-auto flex w-4/12 md:w-2/12 items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                    type="submit"
                    value={updating ? "Atualizando..." : "Atualizar"}
                    disabled={updating}
                />

            </form>

        </div>
    )
}