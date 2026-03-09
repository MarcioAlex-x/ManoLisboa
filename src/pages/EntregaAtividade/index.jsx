import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect, useState } from "react"
import { db, storage } from "../../firebaseConfig"
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"

export const EntregaAtividade = () => {

    const [titulo, setTiulo] = useState('')
    const [texto, setTexto] = useState('')
    const [link, setLink] = useState('')
    const [arquivo, setArquivo] = useState(null)
    const [token, setToken] = useState('')
    const [atividade, setAtividade] = useState(null)
    const [aluno, setAluno] = useState('')
    const [turma, setTurma] = useState('')
    const [instituicaoId, setInstituicaoId] = useState('')
    const [professorId, setProfessorId] = useState('')
    const [turmaId, setTurmaId] = useState('')


    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const atividadeRef = doc(db, 'atividades', id)
            const atividadeSnapshot = await getDoc(atividadeRef)
            const atividadeData = atividadeSnapshot.data()
            setAtividade(atividadeData)
            setInstituicaoId(atividadeData.instituicaoId)
            setProfessorId(atividadeData.professorId)
            setTurmaId(atividadeData.turmaId)
        }
        fetchData()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (!atividade || atividade.token !== token) {
                Swal.fire({
                    icon:'error',
                    title:'Erro',
                    text:'Token inválido, informe o token da atividade.'
                })
                return
            }

            let arquivoUrl = null
            if (arquivo) {
                const arquivoRef = ref(storage, `atividades-do-aluno/${Date.now()}_${arquivo.name}`)
                await uploadBytes(arquivoRef, arquivo)
                arquivoUrl = await getDownloadURL(arquivoRef)
            }

            await addDoc(collection(db, 'entregas'), {
                aluno,
                turma,
                titulo,
                texto,
                link,
                arquivoUrl,
                atividadeId: id,
                instituicaoId,
                professorId,
                turmaId,
                entregueEm: serverTimestamp()
            })

            Swal.fire({
                icon:'success',
                title:'Sucesso',
                text:'Atividade enviada com sucesso',
                showConfirmButton:false,
                timer:1500,
                timerProgressBar:1500
            })

            setTiulo('')
            setTexto('')
            setLink('')

        } catch (err) {

            Swal.fire({
                icon:'error',
                title:'Erro',
                text:'Ocorreu um err ao tentar enviar a atividade, tente outra vez mais tarde',
                showConfirmButton:false,
                timer:2000,
                timerProgressBar:2000
            })

            console.log(err.message)
        }
    }

    return (
        <div className="container mt-5 bg-light rounded p-lg-5 p-0">
            <h2 className="text-center">Entrega de atividade</h2>
            <p className="mb-5 text-center">Preencha os campos com atenção para assegurar a entrega da atividade</p>

            <div className="border rounded p-lg-5 p-2 shadow">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label
                            className="form-label"
                            htmlFor="titulo">Nome completo</label>
                        <input
                            className="form-control"
                            type="text"
                            name="aluno"
                            value={aluno}
                            onChange={e => setAluno(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            className="form-label mt-4"
                            htmlFor="titulo">Turma</label>
                        <input
                            className="form-control"
                            type="text"
                            name="turma"
                            value={turma}
                            onChange={e => setTurma(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            className="form-label mt-4"
                            htmlFor="titulo">Título</label>
                        <input
                            className="form-control"
                            type="text"
                            name="titulo"
                            value={titulo}
                            onChange={e => setTiulo(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            className="form-label mt-4"
                            htmlFor="texto">Texto</label>
                        <textarea
                            rows={20}
                            style={{ resize: 'none' }}
                            className="form-control"
                            name="texto"
                            value={texto}
                            onChange={e => setTexto(e.target.value)}></textarea>
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
                            htmlFor="arquivo">Arquivo PDF</label>
                        <input
                            className="form-control"
                            type="file"
                            accept="application/pdf"
                            onChange={e => setArquivo(e.target.files[0])} />
                    </div>

                    <div>
                        <label
                            className="form-label mt-4"
                            htmlFor="token">Token</label>
                        <input
                            className="form-control"
                            type="text"
                            name="token"
                            value={token}
                            onChange={e => setToken(e.target.value)} />
                    </div>

                    <input
                        className="btn btn-primary d-block w-100 mt-4"
                        type="submit"
                        value="Enviar" />
                </form>

            </div>
            {console.log(atividade?.instituicaoId)}
        </div>
    )
}