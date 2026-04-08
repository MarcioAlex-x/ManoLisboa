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

    if (loading) return <div  className="flex flex-col"><p>Salvando...</p></div>
    return (
        <div className="mt-10">
            <form
                className=""
                onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label
                        htmlFor="instituicao"
                        className="font-semibold">Instituição</label>
                    <select
                        className="border p-2 outline-0"
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
                <div  className="flex flex-col">
                    <label
                        className="font-semibold"
                        htmlFor="nome">Nome</label>
                    <input
                        className="border p-2 outline-0"
                        type="text"
                        placeholder="Informe o nome..."
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)} />
                </div>
                <div  className="flex flex-col">
                    <label
                        className="font-semibold"
                        htmlFor="email">E-mail</label>
                    <input
                        className="border p-2 outline-0"
                        type="email"
                        placeholder="Informe o e-mail..."
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>
                <div  className="flex flex-col">
                    <label
                        className="font-semibold"
                        htmlFor="email">Senha</label>
                    <input
                        className="border p-2 outline-0"
                        type="password"
                        placeholder="Informe a senha..."
                        name="senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)} />
                </div>
                <div className="mt-2">
                    <label
                        className="font-semibold me-2"
                        htmlFor="ativo">Ativo</label>
                    <input type="checkbox"
                        className="form-check-input"
                        name="ativo"
                        id="ativo"
                        value={ativo}
                        onChange={e => setAtivo(e.target.checked)} />
                </div>
                <div  className="flex flex-col">
                    <label
                        className="font-semibold"
                        htmlFor="ativoAte">Ativo Até</label>
                    <input
                        className="border p-2 outline-0"
                        type="date"
                        name="ativoAte"
                        id="ativoAte"
                        value={ativoAte}
                        onChange={e => setAtivoAte(e.target.value)} />
                </div>
                <div  className="flex flex-col">
                    <label
                        className="font-semibold"
                        htmlFor="ativoAte">Nível</label>
                    <select
                        className="border p-2 outline-0"
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
                    className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                    type="submit"
                    value="Salvar" />
            </form>
        </div>
    )
}