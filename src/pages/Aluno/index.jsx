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
        <div className="container mt-5 bg-light p-lg-5 p-2 rounded">
            <h2 className="text-center my-5">Dados do Aluno</h2>

            <div className="row g-4 mb-5 d-flex">
                <div className="col-12 col-md-6" >
                    <div className="border shadow rounded p-4" style={{ height: '500px' }}>
                        <div className="border-0 border-lg-1 p-lg-5 rounded h-100">
                            <h3>{aluno?.nome}</h3>
                            {aluno?.whatsApp &&
                                <p className="m-0">{aluno?.whatsApp}
                                    <a
                                        target="_blank"
                                        href={`https://wa.me/+55${aluno?.whatsApp}`}>
                                        <Phone size={16} color="#20bf6b" />
                                    </a>
                                </p>}
                            <p className="m-0">{aluno?.email}</p>
                            <p className="m-0"><b>Turma:</b> {turma?.serie} {turma?.turma} {turma?.materia}</p>
                            <p className="m-0"><b>Total de faltas:</b> {frequencia.filter(f => !f.presenca).length}</p>
                            <p className="m-0"><b>Total de presenças: </b>{frequencia.filter(f => f.presenca).length}</p>
                            <p className="m-0"><b>Total de atividades: </b>{notas.length}</p>
                            <p className="m-0"><b>Soma total das notas: </b>{somaNotas}</p>

                            {
                                loading ?
                                    <button
                                        onClick={handleDelete}
                                        disabled 
                                        data-bs-toggle="button"
                                        className="btn btn-danger btn-sm m-3">Excluir aluno</button>
                                    : <button
                                        onClick={handleDelete}
                                        className="btn btn-danger btn-sm m-3">Excluir aluno</button>
                            }

                            <Link
                                to={`/atualizar-aluno/${id}`}
                                className="btn btn-success btn-sm m-1">Editar aluno</Link>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 border shadow rounded">
                    <div className=" p-4 position-relative " style={{ height: '500px' }}>
                        <canvas id="freqChart"  ></canvas>
                        <p className="position-absolute top-50 start-50 translate-middle fw-bold fs-5">
                            {porcentagem}% de frequência
                        </p>
                    </div>
                </div>
                <div>
                    <form onSubmit={handleNotasPeriodo}>
                        <div>
                            <h5>Notas por período</h5>
                            <label
                                htmlFor="mediaPeriodo"
                                className="form-label">Período</label>

                            <input
                                type="text"
                                className="form-control"
                                name="mediaPeriodo"
                                value={consultaPeriodo}
                                onChange={e => setConsultaPeriodo(e.target.value)} />
                        </div>
                        <button className="btn btn-primary w-100 my-3">Buscar</button>
                    </form>
                    <div className="d-flex border mt-2 rounded">
                        {notasPeriodo && notasPeriodo.map((nota) => (
                            <div
                                key={nota.id}
                                className=" m-1 p-2">
                                < p className="">{nota.nota}</p>
                            </div>
                        ))}
                        <p className=" m-1 p-2">Total: {totalNotasPeriodo}</p>
                    </div>
                </div>

                <div className="">
                    <div className=" border shadow rounded p-0 p-lg-5">
                        <h3 className="text-center mt-4 ">Atribua alguma nota a {aluno?.nome}</h3>
                        <form
                            onSubmit={handleNota}
                            className="p-2 p-lg-3">
                            <div>
                                <label
                                    className="form-label "
                                    htmlFor="atividade">
                                    Título da atividade
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Initule a atividade"
                                    name="atividade"
                                    value={atividade}
                                    onChange={e => setAtividade(e.target.value)} />
                            </div>
                            <div>
                                <label
                                    htmlFor="tipoAtividade"
                                    className="form-label">Tipo de atividade</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ex. Primeira avaliação"
                                    name="tipoAvaliacao"
                                    value={tipoAtividade}
                                    onChange={e => setTipoAtividade(e.target.value)} />
                            </div>
                            <div>
                                <label
                                    htmlFor="periodo"
                                    className="form-label">Período</label>
                                <select
                                    className="form-control"
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
                            <div>
                                <label
                                    htmlFor="nota"
                                    className="form-label">Nota atribuída</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="nota"
                                    value={nota}
                                    onChange={e => setNota(e.target.value)} />
                            </div>
                            {!loading ?
                                <input
                                    className="btn btn-primary w-100 mt-3"
                                    type="submit"
                                    value="Enviar nota" /> :
                                <input
                                    className="btn btn-primary w-100 mt-3"
                                    disabled data-bs-toggle="button"
                                    type="submit"
                                    value="Enviar nota" />}
                        </form>
                    </div>
                </div>
                <div className="border shadow rounded p-2">
                    <h2 className="text-center mt-5 ">Notas do aluno</h2>
                    {
                        notas.length === 0 ? <p className="text-center">O aluno ainda não recebeu nenhum nota</p> :
                            <div
                                className="d-flex flex-wrap"
                            >
                                {notas.map(nota => (
                                    <div
                                        className="p-3 border rounded m-1 d-flex flex-column justify-content-between"
                                        style={{
                                            flex: '1 1 280px',
                                            maxWidth: '320px',
                                            minWidth: '260px'
                                        }}
                                        key={nota.id}>
                                        {nota.atividade ?
                                            <h5 className="text-center">{nota?.atividade}</h5> :
                                            <h5 className="text-center">Atividade sem título</h5>
                                        }
                                        <hr />
                                        {nota.tipoAtividade ?
                                            <p className="text-center">{nota.tipoAtividade}</p> :
                                            <p className="text-center">Atividade sem tipo</p>
                                        }
                                        <p><b>Período da atividade: </b>{nota.periodo}</p>
                                        <p className=""><b>Nota:</b> {nota.nota}</p>
                                        <p className=""><b>Atribuído em: </b>{nota.createdAt.toDate().toLocaleDateString('pt-BR')}</p>
                                        <button
                                            onClick={() => handleDeleteNota(nota.id)}
                                            className="btn btn-danger w-100 fw-bold">Excluir Nota</button>
                                    </div>
                                ))}
                            </div>
                    }
                </div>

                {/* <div className="border shadow rounded p-2">
                    <h2 className="text-center mt-5 ">Notas do aluno por período</h2>

                </div> */}
            </div>
        </div>
    )
}
