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
        }
    }

    return (
        <div className="container mt-5 bg-light p-sm-2 p-5">
            <h2 className="text-center mb-0 ">Novo Aluno</h2>
            <p className="text-center mb-5 w-75 mx-auto">O aluno é criado por turma, então se acaso o mesmo aluno fizer parte de mais de uma turma o mesmo deverá ser criado novamente nas demais turmas</p>
            <form
                className="border p-lg-5 p-sm-0 shadow"
                onSubmit={handleSubmit}>
                <div>
                    <label
                        className="form-label mt-3"
                        htmlFor="nome">Nome</label>

                    <input
                        className="form-control"
                        type="text"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)} />
                </div>
                <div>
                    <label
                        className="form-label mt-3"
                        htmlFor="nome">WhatsApp</label>

                    <input
                        className="form-control"
                        type="text"
                        name="whatsApp"
                        value={whatsApp}
                        onChange={e => setWhatsapp(e.target.value)} />
                </div>
                <div>
                    <label
                        className="form-label mt-3"
                        htmlFor="nome">E-mail</label>

                    <input
                        className="form-control"
                        type="text"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </div>

                <input
                    className="btn btn-primary d-block w-100 mt-4"
                    type="submit"
                    value="Salvar" />

            </form>
            <h2 className="mt-5 text-center">Alunos desta turma</h2>
            <div className="my-5">
                {alunos.map(aluno => (
                    <div className="border mb-2 py-1 px-3 d-flex align-items-center justify-content-between shadow-sm">
                        <div
                            key={aluno.id}
                            className="">
                            <p className="m-0">Nome: {aluno.nome} </p> <p> {aluno.whatsApp && <span>WhatsApp: {aluno.whatsApp} <a
                                target="_blank"
                                href={`https://wa.me/+55${aluno.whatsApp}`}>
                                <Smartphone size={16} color="#20bf6b" />
                            </a> </span>}</p>
                        </div>
                        <div>
                            <Link className="nav-link" to={`/aluno/${aluno.id}`}>Ir ao aluno <ArrowBigRightDash /> </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}