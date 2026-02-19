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

    const { userData } = useContext(UserContext)
    const { id } = useParams()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

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
                token
            })
            Swal.fire({
                title:"Sucesso",
                icon:'success',
                text:'Atividade criada',
                showConfirmButton:false,
                timer:1500,
                timerProgressBar:1500
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
                title:"Erro",
                icon:'error',
                text:'Ocorreu um erro',
                showConfirmButton:false,
                timer:1500,
                timerProgressBar:1500
            })
            console.error(err.message)
        }
    }

    return (
        <div className="container mt-5 bg-light p-lg-5 p-sm-0">
            <h2 className="text-center">Nova Atividade</h2>
            <p className="text-center mb-5 ">Preencha apenas os campos necessários para a sua nova atividade</p>
            <form 
            className="border p-lg-5 p-sm-2 rounded shadow"
            onSubmit={handleSubmit}>
                <div>
                    <label
                        className="form-label mt-4"
                        htmlFor="nome">Nome da atividade</label>

                    <input
                        className="form-control"
                        type="text"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)} />
                </div>

                <div>
                    <label
                        className="form-label mt-4"
                        htmlFor="orientacoes">Orientações</label>

                    <textarea
                        style={{ resize: 'none' }}
                        className="form-control"
                        rows={10}
                        wrap="hard"
                        name="orientacoes"
                        value={orientacoes}
                        onChange={e => setOrientacoes(e.target.value)}></textarea>
                </div>

                <div>
                    <label
                        className="form-label mt-4"
                        htmlFor="conteudo">Conteúdo</label>

                    <textarea
                        style={{ resize: 'none' }}
                        rows={10}
                        wrap="hard"
                        className="form-control"
                        name="conteudo"
                        value={conteudo}
                        onChange={e => setConteudo(e.target.value)}></textarea>
                </div>

                <div>
                    <label
                        className="form-label mt-4"
                        htmlFor="peso">Peso</label>

                    <input
                        className="form-control"
                        type="text"
                        name="peso"
                        value={peso}
                        onChange={e => setPeso(e.target.value)} />
                </div>

                <div>
                    <label
                        className="form-label mt-4"
                        htmlFor="dataEntrega">Data de entrega</label>

                    <input
                        className="form-control"
                        type="date"
                        name="dataEntrega"
                        value={dataEntrega}
                        onChange={e => setDataEntraga(e.target.value)} />
                </div>

                <div>
                    <label
                        className="form-label mt-4"
                        htmlFor="link">Link</label>

                    <input
                        className="form-control"
                        type="text"
                        name="link"
                        value={link}
                        onChange={e => setLink(e.target.value)} />
                </div>

                <div>
                    <label
                        className="form-label mt-4"
                        htmlFor="link">Arquivo PDF</label>

                    <input
                        className="form-control"
                        type="file"
                        accept="application/pdf"
                        onChange={e => setArquivo(e.target.files[0])} />
                </div>

                <input
                    className="btn btn-primary d-block w-100 mt-4"
                    type="submit"
                    value="Enviar" />
            </form>
        </div>
    )
}