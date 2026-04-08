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
        <div className="mt-10">
            <h2 className="text-center text-3xl">Atualizar as informações de {nome}</h2>
            <form 
            className="mt-10"
            onSubmit={handleUpdate}>
                <div className="flex flex-col">
                    <label
                        htmlFor="nome"
                        className="font-semibold">Nome</label>
                    <input
                        type="text"
                        className="border p-2 outline-0"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.nome)} />
                </div>

                <div className="flex flex-col mt-2">
                    <label
                        htmlFor="whatsApp"
                        className="font-semibold">WhatsApp</label>
                    <input
                        type="text"
                        className="border p-2 outline-0" 
                        name="whatsApp"
                        value={whatsApp}
                        onChange={e => setWhatsApp(e.target.value)} />
                </div>

                <div className="flex flex-col mt-2">
                    <label
                        htmlFor="email"
                        className="font-semibold">E-mail</label>
                    <input
                        type="text"
                        className="border p-2 outline-0 "
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>

                <input 
                className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold "
                type="submit" 
                value="Atualizar" />
            </form>
        </div>
    )
}