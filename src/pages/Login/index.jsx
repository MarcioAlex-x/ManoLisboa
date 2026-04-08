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
    const [loadin, setLoading] = useState(false)

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
            setLoading(true)
            const userCredentials = await signInWithEmailAndPassword(auth, email, senha)

            if(userCredentials.user) navigate('/painel')

        } catch (err) {

            console.error(err.message)

            await Swal.fire({
                title: 'Erro',
                icon: 'error',
                text: 'E-mail ou senha inválidos'
            })
        }finally{
            setLoading(false)
        }
    }

    const handleChangePassword = () => {
        setVerSenha(!verSenha)
    }

    return (
        <div className="mt-10">
            <form
                className=""
                onSubmit={handleSubmit}>

                <h2 className="text-center text-3xl ">
                    Faça login para se conectar com as suas turmas
                </h2>

                <div className="mt-10 flex flex-col">
                    <label className="font-bold" 
                    htmlFor="email">
                        E-mail
                    </label>

                    <input
                        className="border p-2 outline-0"
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div 
                className="flex flex-col mt-2"
                style={{ position: 'relative' }}>
                    <label
                        className="font-bold"
                        htmlFor="senha">
                        Senha
                    </label>

                    <input
                        className="border p-2 outline-0"
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
                        {verSenha  ? <Eye className="text-blue-400" /> : <EyeOff  className="text-blue-400"/>}
                    </div>
                </div>

                <input
                    className="cursor-pointer mt-2 mx-auto flex items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold w-4/12"
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