import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { auth } from "../../firebaseConfig"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

export const Login = () => {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, senha)
            Swal.fire({
                title:'Sucesso',
                icon:'success',
                text:'Logado com sucesso',
                showConfirmButton:false,
                timer:1500,
                timerProgressBar:1500
            })
            navigate('/')

        } catch (err) {
            Swal.fire({
                title:'Erro',
                icon:'error',
                text:'Ocorreu um erro ao tentar logar',
                showConfirmButton:false,
                timer:1500,
                timerProgressBar:1500
            })
            console.error(err.message)
        }
    }

    return (
        <div className="container bg-light mt-5 rounded min-h-100 ">
            <form 
            className="p-lg-5 p-sm-2 shadow rounded border"
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
                <div>
                    <label 
                    className="form-label mt-3"
                    htmlFor="senha">Senha</label>
                    <input
                    className="form-control"
                        type="password"
                        name="senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)} />
                </div>
                <input 
                className="btn btn-primary mt-4 d-block w-100"
                type="submit" 
                value="Entrar" />
            </form>
        </div>
    )
}