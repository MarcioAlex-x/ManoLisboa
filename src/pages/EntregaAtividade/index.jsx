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
        <div className="">
            <h2 className="mt-10 text-center text-3xl">Entrega de atividade</h2>
            <p className="text-center text-xl">Preencha os campos com atenção para assegurar a entrega da atividade</p>

            <div className="">
                <form 
                onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-10">
                        <div className="flex flex-col">
                            <label
                                className="font-bold"
                                htmlFor="titulo">Nome completo</label>
                            <input
                                className="border border-blue-400 outline-0 p-1"
                                type="text"
                                name="aluno"
                                value={aluno}
                                onChange={e => setAluno(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label
                                className="font-bold"
                                htmlFor="titulo">Turma</label>
                            <input
                                className="border border-blue-400 outline-0 p-1"
                                type="text"
                                name="turma"
                                value={turma}
                                onChange={e => setTurma(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label
                                className="font-bold"
                                htmlFor="titulo">Título</label>
                            <input
                                className="border border-blue-400 outline-0 p-1"
                                type="text"
                                name="titulo"
                                value={titulo}
                                onChange={e => setTiulo(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label
                                className="font-bold"
                                htmlFor="token">Token</label>
                            <input
                                className="border border-blue-400 outline-0 p-1 "
                                type="text"
                                name="token"
                                value={token}
                                onChange={e => setToken(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-bold"
                            htmlFor="texto">Texto</label>
                        <textarea
                            rows={10}
                            style={{ resize: 'none' }}
                            className="border border-blue-400 outline-0 p-1"
                            name="texto"
                            value={texto}
                            onChange={e => setTexto(e.target.value)}></textarea>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 mt-10">
                        
                        <div className="flex flex-col">
                            <label
                                className="font-bold"
                                htmlFor="link">Link</label>
                            <input
                                className="border border-blue-400 outline-0 p-1"
                                type="text"
                                name="link"
                                value={link}
                                onChange={e => setLink(e.target.value)} />
                        </div>
                        <div className="flex flex-col">
                            <label
                                className="font-bold"
                                htmlFor="arquivo">Arquivo PDF</label>
                            <input
                                className="border border-blue-400 outline-0 p-1"
                                type="file"
                                accept="application/pdf"
                                onChange={e => setArquivo(e.target.files[0])} />
                        </div>
                        
                    </div>

                    <input
                    className="mt-2 mx-auto flex w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                        type="submit"
                        value="Enviar" />
                </form>

            </div>
            {console.log(atividade?.instituicaoId)}
        </div>
    )
}