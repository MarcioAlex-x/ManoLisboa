import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { auth } from "../../firebaseConfig"
import { useNavigate } from "react-router-dom"

export const Login = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            signInWithEmailAndPassword(auth, email, senha)
            navigate('/')
            alert('Logado com sucesso')

        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        name="senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)} />
                </div>
                <input type="submit" value="Entrar" />
            </form>
        </div>
    )
}