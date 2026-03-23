import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { useContext, useEffect, useState } from "react"
import { auth } from "../../firebaseConfig"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Eye, EyeClosed, EyeOff } from "lucide-react"
import { UserContext } from "../../contexts/UserContext"

export const Login = () => {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [verSenha, setVerSenha] = useState(false)

    const { authError } = useContext(UserContext)

    const navigate = useNavigate()

    useEffect(() => {

        if (authError) {
            Swal.fire({
                icon: "error",
                title: "Acesso bloqueado",
                text: authError,
                confirmButtonText: "Entrar em contato",
                cancelButtonText: "Cancelar",
                showCancelButton: true
            }).then((res) => {

                if (res.isConfirmed) {
                    Swal.fire({
                        icon: "info",
                        title: "Redirecionando",
                        text: "Você será direcionado ao suporte"
                    })

                    window.location.href = "https://wa.me/5583987657531"
                }

            })
        }

    }, [authError])

    const handleNovaSenha = async () => {

        if (!email) {
            Swal.fire({
                icon: 'warning',
                title: 'Informe um e-mail',
                text: 'Digite seu e-mail para receber o link de redefinição'
            })
            return
        }

        try {

            await sendPasswordResetEmail(auth, email)

            Swal.fire({
                icon: 'success',
                title: 'E-mail enviado',
                text: `Um link foi enviado para ${email}`
            })

        } catch (err) {

            console.error(err.message)

            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível enviar o e-mail de redefinição',
            })
        }
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            await signInWithEmailAndPassword(auth, email, senha)

            navigate('/painel')

        } catch (err) {

            console.error(err.message)

            Swal.fire({
                title: 'Erro',
                icon: 'error',
                text: 'E-mail ou senha inválidos'
            })
        }
    }

    const handleChangePassword = () => {
        setVerSenha(!verSenha)
    }

    return (
        <div className="container bg-light mt-5 rounded min-h-100 ">
            <form
                className="p-lg-5 p-2 shadow rounded border"
                onSubmit={handleSubmit}>

                <h2 className="text-center mb-3">
                    Faça login para se conectar com as suas turmas
                </h2>

                <div>
                    <label className="form-label" htmlFor="email">
                        E-mail
                    </label>

                    <input
                        className="form-control"
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div style={{ position: 'relative' }}>
                    <label
                        className="form-label mt-3"
                        htmlFor="senha">
                        Senha
                    </label>

                    <input
                        className="form-control"
                        type={verSenha ? "text" : "password"}
                        name="senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                    />

                    <div
                        style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '16px',
                            cursor: 'pointer'
                        }}
                        onClick={handleChangePassword}
                    >
                        {verSenha ? <Eye /> : <EyeOff />}
                    </div>
                </div>

                <input
                    className="btn btn-primary mt-4 d-block w-100"
                    type="submit"
                    value="Entrar"
                />

            </form>

            <div className="text-center">
                <p
                    onClick={handleNovaSenha}
                    className="mt-5"
                    style={{ cursor: 'pointer' }}
                >
                    Esqueci minha senha
                </p>
            </div>
        </div>
    )
}