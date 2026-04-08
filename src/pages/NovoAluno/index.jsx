import { addDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { useContext, useEffect, useState } from "react"
import { db } from "../../firebaseConfig"
import { UserContext } from "../../contexts/UserContext"
import { Link, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { ArrowBigRightDash, Smartphone } from "lucide-react"

export const NovoAluno = () => {


    const [nome, setNome] = useState('')
    const [alunos, setAlunos] = useState([])
    const [whatsApp, setWhatsapp] = useState('')
    const [email, setEmail] = useState('')
    const { userData } = useContext(UserContext)
    const [loading, setLoading] = useState(false)

    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {

            const q = query(collection(db, 'alunos'), where('professorId', '==', userData.uid), orderBy('nome', 'asc'))
            const alunosSnapshot = await getDocs(q)
            const alunos = alunosSnapshot.docs.map((aluno) => (
                { id: aluno.id, ...aluno.data() }
            ))

            setAlunos(alunos)
        }
        fetchData()
    }, [userData])



    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            if (!id || !userData) return

            await addDoc(collection(db, 'alunos'), {
                nome,
                whatsApp,
                email,
                professorId: userData.uid,
                turmaId: id
            })
            setNome('')
            setEmail('')
            setWhatsapp('')

            Swal.fire({
                title: "Sucesso",
                icon: 'success',
                text: 'Aluno criado com sucesso',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })

            const q = query(collection(db, 'alunos'), where('professorId', '==', userData.uid), orderBy('nome', 'asc'))
            const alunosSnapshot = await getDocs(q)
            const alunos = alunosSnapshot.docs.map((aluno) => (
                { id: aluno.id, ...aluno.data() }
            ))

            setAlunos(alunos)

        } catch (err) {
            console.error(err.message)
        } finally {
            [
                setLoading(false)
            ]
        }
    }

    return (
        <div className="mt-10">
            <h2 className="text-center text-3xl ">Novo Aluno</h2>
            <p
                style={{ fontSize: '14px' }}
                className="text-center md:w-8/12 m-auto w-full">O aluno é criado por turma, então se acaso o mesmo aluno fizer parte de mais de uma turma o mesmo deverá ser criado novamente nas demais turmas</p>
            <form
                className=""
                onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-10">
                    <div className="flex flex-col">
                        <label
                            className="font-semibold"
                            htmlFor="nome">Nome</label>
                        <input
                            className="border p-2 outline-0"
                            type="text"
                            name="nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold"
                            htmlFor="nome">WhatsApp</label>
                        <input
                            className="border p-2 outline-0"
                            type="text"
                            name="whatsApp"
                            value={whatsApp}
                            onChange={e => setWhatsapp(e.target.value)} />
                    </div>
                    <div className="flex flex-col">
                        <label
                            className="font-semibold"
                            htmlFor="nome">E-mail</label>
                        <input
                            className="border p-2 outline-0"
                            type="text"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>
                {!loading ?
                    <input
                        className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                        type="submit"
                        value="Salvar" />
                    :
                    <input
                        className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-gray-700 font-bold"
                        disabled
                        type="submit"
                        value="Salvar" />
                }
            </form>
            {alunos.length >0 ? 
            (<div>
                <h2 className="mt-10 text-center text-2xl">{alunos.length} alunos cadastrados</h2>
                
                <div className="my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {alunos.map(aluno => (
                        <Link key={aluno.id}
                            className=" border border-blue-700 p-2 flex flex-col items-center transition delay-150 ease-in-out hover:bg-gray-900" to={`/aluno/${aluno.id}`}>
                            <p className="r">{aluno.nome} </p>
                        </Link>
                    ))}
                </div>
            </div>):
            (<div>
                <h2 className="mt-10 text-center text-2xl">Cadastre o seu primeiro aluno</h2>
            </div>)}
        </div>
    )
}