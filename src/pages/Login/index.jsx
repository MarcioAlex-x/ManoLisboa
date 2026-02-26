import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { auth } from "../../firebaseConfig"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Eye, EyeClosed } from "lucide-react"

export const Login = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [verSenha, setVerSenha] = useState(false)

    const navigate = useNavigate()

    const handleNovaSenha = () => {
        sendPasswordResetEmail(auth, email)

        if (!email) {
            Swal.fire({
                icon:'warning',
                title:'E-mail não encontrado',
                text:'Informe ou verifique o e-mail informado. Verifique também nos spams',
                showConfirmButton:true
            })

            return
        }
        try {
            Swal.fire({
                icon: 'success',
                title:'E-mail enviado',
                text:`Um link foi enviado ao seu e-mail ${email}`,
                showConfirmButton:true
            })
        } catch (err) {
            console.error(err.message)
            Swal.fire({
                icon: 'error',
                title:'Erro',
                text:`Aconteceu um erro ao tentar enviar um e-mail de atualização de senha`,
                showConfirmButton:true
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, senha)
            Swal.fire({
                title: 'Sucesso',
                icon: 'success',
                text: 'Logado com sucesso',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })
            navigate('/painel')

        } catch (err) {
            Swal.fire({
                title: 'Erro',
                icon: 'error',
                text: 'Ocorreu um erro ao tentar logar',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })
            console.error(err.message)
        }
    }

    const handleChangePassword = () => {
        if (verSenha) setVerSenha(false)
        if (!verSenha) setVerSenha(true)
    }

    return (
        <div className="container bg-light mt-5 rounded min-h-100 ">
            <form
                className=" p-lg-5 p-2 shadow rounded border"
                onSubmit={handleSubmit}>
                <h2 className="text-center mb-3">Faça login para se conectar com as suas turmas</h2>
                <div>
                    <label
                        className="form-label"
                        htmlFor="email">E-mail</label>
                    <input
                        className="form-control"
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>
                <div style={{ position: 'relative' }}>
                    <label
                        className="form-label mt-3"
                        htmlFor="senha">Senha</label>
                    <input
                        className="form-control"
                        type={verSenha ? "text" : "password"}
                        name="senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)} />

                    <div
                        style={{ position: 'absolute', bottom: '8px', right: '16px', cursor: 'pointer' }}
                        onClick={handleChangePassword}>
                        {
                            verSenha ?
                                <Eye />
                                :
                                <EyeClosed />
                        }
                    </div>
                </div>
                <input
                    className="btn btn-primary mt-4 d-block w-100"
                    type="submit"
                    value="Entrar" />
            </form>
            <div className="text-center">
                <p
                    onClick={handleNovaSenha}
                    className="mt-5">Esqueci minha senha</p>
            </div>
        </div>
    )
}