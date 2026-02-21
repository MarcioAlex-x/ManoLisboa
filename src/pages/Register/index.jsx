import { createUserWithEmailAndPassword } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, db } from "../../firebaseConfig"
import { setDoc, doc, collection, getDocs } from "firebase/firestore"

export const Register = () => {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [nome, setNome] = useState('')
    const [loading, setLoading] = useState(false)
    const [instituicoes, setInstituicoes] = useState([])
    const [instituicaoId, setInstituicaoId] = useState('')


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

            const novoUsuario = await setDoc(doc(db, 'usuarios', user.uid), {
                nome,
                tipo: 'professor',
                instituicaoId
            })

            alert("Usuário criado com sucesso.")

        } catch (err) {
            alert('Erro ao tentar criar novo usuário.')
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
                <input
                    className="btn btn-primary w-100 mt-3"
                    type="submit"
                    value="Salvar" />
            </form>
        </div>
    )
}