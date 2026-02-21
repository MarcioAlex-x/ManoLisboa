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
        <div className="container p-0 p-lg-5 my-5">
            <h2 className="my-5 text-center" >Nova Instituição</h2>
            <form
                className="py-5 px-2 p-lg-5 border shadow rounded"
                onSubmit={handleSubmit}>
                <label
                    className="form-label"
                    htmlFor="instituicao">Nova Instituição</label>
                <input
                    className="form-control mb-2"
                    type="text"
                    name="instituicao"
                    value={instituicao}
                    onChange={e => setInstituicao(e.target.value)} />
                <input
                className="btn btn-primary w-100" 
                type="submit" 
                value="Salvar" />
            </form>
        </div>
    )
}