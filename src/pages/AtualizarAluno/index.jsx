import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../firebaseConfig"
import Swal from "sweetalert2"

export const AtualizarAluno = () => {

    const [alunoData, setAlunoData] = useState(null)
    const [nome, setNome] = useState('')
    const [whatsApp, setWhatsApp] = useState('')
    const [email, setEmail] = useState('')

    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const alunoRef = doc(db, 'alunos', id)
                const alunoSnapshot = await getDoc(alunoRef)
                setAlunoData(alunoSnapshot.data())

                setNome(alunoData?.nome)
                setWhatsApp(alunoData?.whatsApp)
                setEmail(alunoData?.email)

            } catch (err) {
                console.error(err.message)
            }
        }
        fetchData()
    }, [id])

    const handleUpdate = async (e) => {
        
        e.preventDefault()

        try {
            const alunoRef = doc(db, 'alunos', id)
            await updateDoc(alunoRef, {
                nome,
                whatsApp,
                email
            })

            Swal.fire({
                icon: 'sucess',
                title: 'Sucesso',
                text: 'Aluno atualizado com sucesso',
                timer: 1500,
                timerProgressBar: 1500
            })

            navigate('/alunos')

        } catch (err) {

            console.error(err.message)
            
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Aconteceu um erro ao tentar atualizar aluno',
                timer: 1500,
                timerProgressBar: 1500
            })
        }
    }

    return (
        <div className="container mt-5 bg-light p-lg-5 p-2 rounded">
            <h2 className="text-center my-5">Atualizar as informações de {nome}</h2>
            <form 
            className="border p-lg-5 p-2 rounded shadow"
            onSubmit={handleUpdate}>
                <div>
                    <label
                        htmlFor="nome"
                        className="form-label">Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.nome)} />
                </div>

                <div>
                    <label
                        htmlFor="whatsApp"
                        className="form-label">WhatsApp</label>
                    <input
                        type="text"
                        className="form-control" name="whatsApp"
                        value={whatsApp}
                        onChange={e => setWhatsApp(e.target.value)} />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="form-label">E-mail</label>
                    <input
                        type="text"
                        className="form-control"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>

                <input 
                className="btn btn-success w-100 mt-2"
                type="submit" 
                value="Atualizar" />
            </form>
        </div>
    )
}