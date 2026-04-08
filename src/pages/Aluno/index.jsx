import { useContext, useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, where, writeBatch } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { UserContext } from "../../contexts/UserContext"
import { Phone } from "lucide-react"
import Chart from "chart.js/auto"
import Swal from "sweetalert2"
import { deleteByQuery } from "../../deleteByQuery"

export const Aluno = () => {

    const [aluno, setAluno] = useState(null)
    const [turma, setTurma] = useState(null)
    const [frequencia, setFrequencia] = useState([])
    const [atividade, setAtividade] = useState('')
    const [nota, setNota] = useState('')
    const [periodo, setPeriodo] = useState('')
    const [tipoAtividade, setTipoAtividade] = useState('')
    const [notas, setNotas] = useState([])
    const [consultaPeriodo, setConsultaPeriodo] = useState('')
    const [notasPeriodo, setNotasPeriodo] = useState([])
    const [totalNotasPeriodo, setTotalNotasPeriodo] = useState(Number())
    const [loading, setLoading] = useState(false)

    const { id } = useParams()
    const navigate = useNavigate()
    const { userData } = useContext(UserContext)

    // informações sobre o aluno
    useEffect(() => {

        if (!id) return

        const fetchData = async () => {

            const alunoRef = doc(db, 'alunos', id)
            const alunoSnapshot = await getDoc(alunoRef)

            if (!alunoSnapshot.exists()) return

            const alunoData = alunoSnapshot.data()
            setAluno(alunoData)

            if (alunoData.turmaId) {
                const turmaRef = doc(db, 'turmas', alunoData.turmaId)
                const turmaSnapshot = await getDoc(turmaRef)
                setTurma(turmaSnapshot.data())
            }

            const freqRef = query(
                collection(db, 'frequencia'),
                where('alunoId', '==', id),
                where('turmaId', '==', alunoData.turmaId),
                where('professorId', '==', userData.uid)
            )

            const freqSnapshot = await getDocs(freqRef)

            const listaFreq = freqSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            setFrequencia(listaFreq)
        }

        fetchData()

    }, [id, userData.uid])

    const faltas = frequencia.filter(f => !f.presenca).length
    const presencas = frequencia.filter(f => f.presenca).length

    // gráfico de presença
    useEffect(() => {
        if (!frequencia.length) return
        const ctx = document.querySelector('#freqChart')

        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Presenças', 'Faltas'],
                datasets: [
                    {
                        label: 'Frequência',
                        data: [presencas, faltas],
                        backgroundColor: ["#26de81", "#fc5c65"],
                    }
                ],
            },
            options: {
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        })


        return () => chart.destroy()

    }, [faltas, presencas, frequencia])

    const porcentagem = Math.round((presencas / (presencas + faltas)) * 100) || 0

    // total de notas do aluno no card das informações
    useEffect(() => {
        const fetchNotasAluno = async () => {
            const notasRef = collection(db, 'alunos', id, 'notas')
            const notasSnapshot = await getDocs(notasRef)
            const notasData = notasSnapshot.docs.map(notas => ({
                id: notas.id, ...notas.data()
            }))
            setNotas(notasData)
        }
        fetchNotasAluno()
    }, [id])

    // apagar aluno
    const handleDelete = async () => {
        try {
            setLoading(true)
            const confirm = await Swal.fire({
                icon: 'question',
                title: 'Tem certeza?',
                text: 'Após apagado todas as informações do aluno serão apagadas permanentemente'
            })

            if (!confirm.isConfirmed) return

            const batch = writeBatch(db)

            const notasRef = collection(db, 'alunos', id, 'notas')
            const notasSnapshot = await getDocs(notasRef)

            notasSnapshot.forEach(notaDoc => {
                batch.delete(notaDoc.ref)
            })

            await deleteByQuery(
                query(collection(db, 'frequencia'), where('alunoId', '==', id))
            )

            const alunoRef = doc(db, 'alunos', id)
            batch.delete(alunoRef)

            await batch.commit()

            Swal.fire({
                title: 'Sucesso',
                icon: 'success',
                text: 'Aluno apagado com sucesso',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })

            // gcloud firestore bulk-delete

            navigate('/alunos')
        } catch (err) {
            console.error(err.message)
            Swal.fire({
                title: 'Erro',
                icon: 'error',
                text: 'Houve um erro ao tentar apagar o aluno',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })
        } finally {
            setLoading(false)
        }
    }

    // atribuir nota
    const handleNota = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const notasRef = collection(db, 'alunos', id, 'notas')
            await addDoc(notasRef, {
                atividade,
                periodo: Number(periodo),
                tipoAtividade,
                nota: Number(nota),
                createdAt: serverTimestamp()
            })

            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Nota atribuída',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })

            const snapshot = await getDocs(notasRef)
            const notasData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setNotas(notasData)

        } catch (err) {

            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao tentar atribuir a nota',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: 1500
            })
            console.error(err.message)
        } finally {
            setLoading(false)
        }

    }
    const somaNotas = notas.reduce((total, n) => total + (n.nota || 0), 0)

    // apaga a nota 
    const handleDeleteNota = async (notaId) => {
        try {
            const notaRef = doc(db, 'alunos', id, 'notas', notaId)
            await deleteDoc(notaRef)

            setNotas(prev => prev.filter(n => n.id !== notaId))

            Swal.fire({
                icon: 'success',
                title: 'Sucesso',
                text: 'Nota excluída',
                showConfirmButton: false,
                timer: 1500
            })
        } catch (err) {
            console.error(err)
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro ao excluir nota'
            })
        }
    }

    // filtra nota por perioro
    const handleNotasPeriodo = (e) => {
        e.preventDefault()

        const periodoNum = Number(consultaPeriodo)
        const filtradas = notas.filter(n => n.periodo === periodoNum)

        setNotasPeriodo(filtradas)

        const total = filtradas.reduce((t, n) => t + (n.nota || 0), 0)

        setTotalNotasPeriodo(total)
    }

    return (
        <div className="mt-10">
            {/* <h2 className="text-center text-3xl mb-5">Dados do Aluno</h2> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-3" >
                    <div className="" >
                        <div className="">
                            <h3 className="text-center text-4xl mb-5">{aluno?.nome}</h3>
                            {aluno?.whatsApp &&
                                <p className="flex items-center gap-3">{aluno?.whatsApp}
                                    <a
                                        target="_blank"
                                        href={`https://wa.me/+55${aluno?.whatsApp}`}>
                                        <Phone size={16} color="#20bf6b" />
                                    </a>
                                </p>}
                            <p className="">{aluno?.email}</p>
                            <p className=""><b>Turma:</b> {turma?.serie} {turma?.turma} {turma?.materia}</p>
                            <p className=""><b>Total de faltas:</b> {frequencia.filter(f => !f.presenca).length}</p>
                            <p className=""><b>Total de presenças: </b>{frequencia.filter(f => f.presenca).length}</p>
                            <p className=""><b>Total de atividades: </b>{notas.length}</p>
                            <p className=""><b>Soma total das notas: </b>{somaNotas}</p>

                            <div className="flex mt-10">
                                {
                                    loading ?
                                        <button
                                            onClick={handleDelete}
                                            disabled
                                            className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-gray-500 transition delay-150 ease-in-out hover:bg-green-900 font-bold">Excluir</button>
                                        : <button
                                            onClick={handleDelete}
                                            className="mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-amber-800 transition delay-150 ease-in-out hover:bg-amber-900 font-bold cursor-pointer">Excluir</button>
                                }
                                <Link
                                    to={`/atualizar-aluno/${id}`}
                                    className="mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold">Editar</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="w-8/12 flex flex-col justify-center items-center m-auto mt-6 md:mt-0">
                        <canvas id="freqChart" className=""></canvas>
                        <p className="text-center text-xl">
                            {porcentagem}% de frequência
                        </p>
                    </div>
                </div>

                <div className="border border-blue-500 p-4">
                    <form onSubmit={handleNotasPeriodo}>
                        <div>
                            <h5 className="text-center text-xl">Notas por período</h5>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="mediaPeriodo"
                                    className="font-bold">Período</label>
                                <input
                                    type="text"
                                    className="border outline-0 p-1"
                                    name="mediaPeriodo"
                                    value={consultaPeriodo}
                                    onChange={e => setConsultaPeriodo(e.target.value)} />
                            </div>
                        </div>
                        <button className="mt-2 mx-auto flex  w-12/12 md:w-12/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold cursor-pointer">Buscar</button>
                    </form>
                    <div className="">
                        <p className="text-xl">Total: {totalNotasPeriodo}</p>
                        {notasPeriodo && notasPeriodo.map((nota) => (
                            <div
                                key={nota.id}
                                className="text-xl">
                                < p className="border-t"> {nota.nota}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-blue-500 p-4">
                    <div className="">
                        <h3 className="text-center text-xl mb-5">Atribua alguma nota a {aluno?.nome}</h3>
                        <form
                            onSubmit={handleNota}
                            className="">
                            <div className="flex flex-col">
                                <label
                                    className="font-bold"
                                    htmlFor="atividade">
                                    Título da atividade
                                </label>
                                <input
                                    type="text"
                                    className="border outline-0 p-1"
                                    placeholder="Initule a atividade"
                                    name="atividade"
                                    value={atividade}
                                    onChange={e => setAtividade(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="tipoAtividade"
                                    className="font-bold mt-2">Tipo de atividade</label>
                                <input
                                    type="text"
                                    className="border outline-0 p-1"
                                    placeholder="Ex. Primeira avaliação"
                                    name="tipoAvaliacao"
                                    value={tipoAtividade}
                                    onChange={e => setTipoAtividade(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="periodo"
                                    className="font-bold mt-2">Período</label>
                                <select
                                    className="border outline-0 p-1 bg-gray-800"
                                    name="periodo"
                                    id="periodo"
                                    value={periodo}
                                    onChange={e => setPeriodo(e.target.value)}>
                                    <option value="">Selecione</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label
                                    htmlFor="nota"
                                    className="font-bold mt-2">Nota atribuída</label>
                                <input
                                    type="number"
                                    className="border outline-0 p-1"
                                    name="nota"
                                    value={nota}
                                    onChange={e => setNota(e.target.value)} />
                            </div>
                            {!loading ?
                                <input
                                    className="mt-2 mx-auto flex  w-12/12 md:w-12/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold cursor-pointer"
                                    type="submit"
                                    value="Enviar nota" /> :
                                <input
                                    className="mt-2 mx-auto flex  w-12/12 md:w-12/12  items-center justify-center gap-1 p-2 bg-gray-400 font-bold cursor-pointer"
                                    type="submit"
                                    value="Enviar nota" />}
                        </form>
                    </div>
                </div>
                

                {/* <div className="border shadow rounded p-2">
                    <h2 className="text-center mt-5 ">Notas do aluno por período</h2>

                </div> */}
            </div>
            <div className="mt-5 p-5">
                    <h2 className="text-center text-xl mb-5">Notas do aluno</h2>
                    {
                        notas.length === 0 ? <p className="text-center text-xl">O aluno ainda não recebeu nenhum nota</p> :
                            <div
                                className="grid grid-cols-1 md:grid-cols-3"
                            >
                                {notas.map(nota => (
                                    <div
                                        className="border border-blue-500 p-2"
                                        style={{
                                            flex: '1 1 280px',
                                            maxWidth: '320px',
                                            minWidth: '260px'
                                        }}
                                        key={nota.id}>
                                        {nota.atividade ?
                                            <h5 className="">{nota?.atividade}</h5> :
                                            <h5 className="">Atividade sem título</h5>
                                        }
                                        <hr />
                                        {nota.tipoAtividade ?
                                            <p className="">{nota.tipoAtividade}</p> :
                                            <p className="">Atividade sem tipo</p>
                                        }
                                        <p><b>Período da atividade: </b>{nota.periodo}</p>
                                        <p className=""><b>Nota:</b> {nota.nota}</p>
                                        <p className=""><b>Atribuído em: </b>{nota.createdAt.toDate().toLocaleDateString('pt-BR')}</p>
                                        <button
                                            onClick={() => handleDeleteNota(nota.id)}
                                            className="mt-2 mx-auto flex  w-12/12 md:w-12/12  items-center justify-center gap-1 p-2 bg-orange-600 transition delay-150 ease-in-out hover:bg-orange-700 font-bold cursor-pointer">Excluir Nota</button>
                                    </div>
                                ))}
                            </div>
                    }
                </div>
        </div>
    )
}
