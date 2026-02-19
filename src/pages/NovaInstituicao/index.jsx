import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { db } from "../../firebaseConfig"

export const NovaInstituicao = () => {
    const [instituicao, setInstituicao] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addDoc(collection(db, 'instituicoes'), {
                instituicao
            })
            setInstituicao('')
            alert('Instituição criada com sucesso.')
        } catch (err) {
            alert('Ocorre um erro ao tentar criar a nova instituição')
            console.error(err.message)
        }
    }

    return (
        <div>
            <h2>Nova Instituição</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="instituicao"
                    value={instituicao}
                    onChange={e => setInstituicao(e.target.value)} />
            </form>
            <input type="submit" value="Salvar" />
        </div>
    )
}