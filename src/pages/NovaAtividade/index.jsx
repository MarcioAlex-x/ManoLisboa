import { useContext, useState } from "react"
import { UserContext } from "../../contexts/UserContext"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db, storage } from "../../firebaseConfig"
import { useParams } from "react-router-dom"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import Swal from "sweetalert2"

function gerarToken() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVXYWZabcdefghijklmnopqrstuvxywz1234567890'
    let resultado = ''
    for (let i = 0; i < 4; i++) {
        resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    return resultado
}

export const NovaAtividade = () => {

    const [nome, setNome] = useState('')
    const [orientacoes, setOrientacoes] = useState('')
    const [conteudo, setConteudo] = useState('')
    const [peso, setPeso] = useState('')
    const [link, setLink] = useState('')
    const [dataEntrega, setDataEntraga] = useState('')
    const [arquivo, setArquivo] = useState(null)
    const [token, setToken] = useState(() => gerarToken())
    const [paraLeitura, setParaLeitura] = useState(false)
    const [loading, setLoading] = useState(false)

    const { userData } = useContext(UserContext)
    const { id } = useParams()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            let arquivoUrl = null

            if (arquivo) {
                const arquivoRef = ref(storage, `atividades-do-professor/${userData.uid}/${Date.now()}_${arquivo.name}`)
                await uploadBytes(arquivoRef, arquivo)
                arquivoUrl = await getDownloadURL(arquivoRef)
            }

            await addDoc(collection(db, 'atividades'), {
                nome,
                orientacoes,
                conteudo,
                peso,
                dataEntrega,
                link,
                arquivoUrl,
                criadoEm: serverTimestamp(),
                professorId: userData.uid,
                turmaId: id,
                instituicaoId: userData.instituicaoId,
                token,
                paraLeitura
            })
            Swal.fire({
                title: "Sucesso",
                icon: 'success',
                text: 'Atividade criada',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })
            setNome('')
            setOrientacoes('')
            setConteudo('')
            setPeso('')
            setDataEntraga('')
            setLink('')
            setArquivo(null)
            setToken(gerarToken())
        } catch (err) {
            Swal.fire({
                title: "Erro",
                icon: 'error',
                text: 'Ocorreu um erro',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-10">
            <h2 className="text-center text-3xl">Nova Atividade</h2>
            <p className="text-center mb-5 ">Preencha apenas os campos necessários para a sua nova atividade</p>
            <form
                
                onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <label
                            className="font-semibold mt-2"
                            htmlFor="nome">Nome da atividade</label>
                        <input
                            className="border p-2 outline-0"
                            type="text"
                            name="nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold mt-2"
                            htmlFor="peso">Peso</label>
                        <input
                            className="border p-2 outline-0"
                            type="text"
                            name="peso"
                            value={peso}
                            onChange={e => setPeso(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold mt-2"
                            htmlFor="orientacoes">Orientações</label>
                        <textarea
                            style={{ resize: 'none' }}
                            className="border p-2 outline-0"
                            rows={10}
                            wrap="hard"
                            name="orientacoes"
                            value={orientacoes}
                            onChange={e => setOrientacoes(e.target.value)}></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold mt-2"
                            htmlFor="conteudo">Conteúdo</label>
                        <textarea
                            style={{ resize: 'none' }}
                            rows={10}
                            wrap="hard"
                            className="border p-2 outline-0"
                            name="conteudo"
                            value={conteudo}
                            onChange={e => setConteudo(e.target.value)}></textarea>
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold mt-2"
                            htmlFor="dataEntrega">Data de entrega</label>
                        <input
                            className="border p-2 outline-0"
                            type="date"
                            name="dataEntrega"
                            value={dataEntrega}
                            onChange={e => setDataEntraga(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold mt-2"
                            htmlFor="link">Link</label>
                        <input
                            className="border p-2 outline-0"
                            type="text"
                            name="link"
                            value={link}
                            onChange={e => setLink(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold mt-2"
                            htmlFor="link">Arquivo PDF</label>
                        <input
                            className="border p-2 outline-0"
                            type="file"
                            accept="application/pdf"
                            onChange={e => setArquivo(e.target.files[0])} />
                    </div>
                    <div className="flex flex-col p-2 border">
                        <div className="flex  items-center gap-2">
                            <label
                                htmlFor="paraLeitura"
                                className="font-semibold">Atividade Para Consulta</label>
                            <input
                                type="checkbox"
                                className=""
                                autoComplete="off"
                                name="paraLeitura"
                                value={paraLeitura}
                                onChange={e=>setParaLeitura(e.target.checked)} />
                        </div>
                    
                        <p style={{fontSize:"11px"}}>Não havendo a necessidade do aluno entregar a atividade</p>
                    </div>
                </div>

                {!loading ? <input
                    className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                    type="submit"
                    value="Enviar" /> :
                    <input
                        className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-gray-700 font-bold"
                        disabled
                        type="submit"
                        value="Enviar" />

                }
            </form>
        </div>
    )
}