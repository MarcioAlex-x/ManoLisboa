import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { UserContext } from "../../contexts/UserContext"
import { Phone } from "lucide-react"
import Chart from "chart.js/auto"

export const Aluno = () => {

    const [aluno, setAluno] = useState(null)
    const [turma, setTurma] = useState(null)
    const [frequencia, setFrequencia] = useState([])

    const { id } = useParams()
    const { userData } = useContext(UserContext)

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
            options:{
                cutout: '65%',
                plugins:{
                    legend:{
                        position:'bottom'
                    }
                }
            }
        })

        
        return ()=>chart.destroy()
        
    }, [faltas, presencas, frequencia])
    const porcentagem = Math.round((presencas / (presencas + faltas)) * 100) || 0



    return (
        <div className="container mt-5 bg-light p-lg-5 p-sm-2">
            <h2 className="text-center mb-5">Dados do aluno</h2>

            <div className="row g-4 mb-5 d-flex">
                <div className="col-12 col-md-6" >
                    <div className="border shadow rounded p-4" style={{height:'500px'}}>
                        <div className="border p-lg-5 rounded h-100">
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
                            <p className="m-0">Turma: {turma?.serie} {turma?.turma} {turma?.materia}</p>
                            <p className="m-0">Total de faltas: {frequencia.filter(f => !f.presenca).length}</p>
                            <p className="m-0">Total de presenças: {frequencia.filter(f => f.presenca).length}</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 border shadow rounded">
                    <div className=" p-4 position-relative "  style={{height:'500px'}}>
                        <canvas id="freqChart"  ></canvas>
                        <p className="position-absolute top-50 start-50 translate-middle fw-bold fs-5">
                            {porcentagem}% de frequência
                        </p>
                    </div>
                </div>
            </div>

            <h3>Atividades entregues</h3>
        </div>
    )
}
