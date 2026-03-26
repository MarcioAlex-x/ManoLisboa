import { createUserWithEmailAndPassword } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, db } from "../../firebaseConfig"
import { setDoc, doc, collection, getDocs, Timestamp } from "firebase/firestore"
import Swal from "sweetalert2"
import { data } from "react-router-dom"


export const Register = () => {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [nome, setNome] = useState('')
    const [loading, setLoading] = useState(false)
    const [instituicoes, setInstituicoes] = useState([])
    const [instituicaoId, setInstituicaoId] = useState('')
    const [ativo, setAtivo] = useState(false)
    const [nivel, setNivel] = useState('')

    const [ativoAte, setAtivoAte] = useState('')


    useEffect(() => {
        const fetchData = async () => {
            try {
                const instituicoesRef = collection(db, 'instituicoes')
                const instituicoesSnapshot = await getDocs(instituicoesRef)
                const instituicoesData = instituicoesSnapshot.docs.map(doc => (
                    { id: doc.id, ...doc.data() }
                ))
                setInstituicoes(instituicoesData)
                console.log(instituicoes)
            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const userCredentials = await createUserWithEmailAndPassword(auth, email, senha)
            const user = userCredentials.user

            const dataExpira = ativo ? Timestamp.fromDate(new Date(ativoAte)) : null

            const novoUsuario = await setDoc(doc(db, 'usuarios', user.uid), {
                nome,
                tipo: 'professor',
                instituicaoId,
                ativo,
                nivel,
                ativoAte: dataExpira
            })

            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Usuário criado com sucesso',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao tentar criar o usuário. Favor tentar novamente mais tarde.',
                timer: 1500,
                timerProgressBar: 1500
            })
            console.log(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div><p>Salvando...</p></div>
    return (
        <div className="container bg-light my-5 p-lg-5 p-0">
            <form
                className="py-lg-5 px-lg-5 py-5 px-2 border rounded shadow"
                onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor="instituicao"
                        className="form-label">Instituição</label>
                    <select
                        className="form-control"
                        name="instituicao"
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
                <div>
                    <label
                        className="form-label"
                        htmlFor="nome">Nome</label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Informe o nome..."
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)} />
                </div>
                <div>
                    <label
                        className="form-label"
                        htmlFor="email">E-mail</label>
                    <input
                        className="form-control"
                        type="email"
                        placeholder="Informe o e-mail..."
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label
                        className="form-label"
                        htmlFor="email">Senha</label>
                    <input
                        className="form-control"
                        type="password"
                        placeholder="Informe a senha..."
                        name="senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)} />
                </div>
                <div className="mt-2">
                    <label
                        className="form-label me-2"
                        htmlFor="ativo">Ativo</label>
                    <input type="checkbox"
                        className="form-check-input"
                        name="ativo"
                        id="ativo"
                        value={ativo}
                        onChange={e => setAtivo(e.target.checked)} />
                </div>
                <div>
                    <label
                        className="form-label"
                        htmlFor="ativoAte">Ativo Até</label>
                    <input
                        className="form-control"
                        type="date"
                        name="ativoAte"
                        id="ativoAte"
                        value={ativoAte}
                        onChange={e => setAtivoAte(e.target.value)} />
                </div>
                <div>
                    <label
                        className="form-label"
                        htmlFor="ativoAte">Nível</label>
                    <select
                        className="form-control"
                        name="nivel"
                        id="nivel"
                        value={nivel}
                        onChange={e => setNivel(e.target.value)}>
                        <option value="">Selecione</option>
                        <option value="1">Nível 1</option>
                        <option value="2">Nível 2</option>
                    </select>
                </div>
                <input
                    className="btn btn-primary w-100 mt-3"
                    type="submit"
                    value="Salvar" />
            </form>
        </div>
    )
}