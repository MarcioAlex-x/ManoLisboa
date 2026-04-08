import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { db } from "../../firebaseConfig"

export const NovaInstituicao = () => {
    const [instituicao, setInstituicao] = useState('')
    const [codigo, setCodigo] = useState('')

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            await addDoc(collection(db, 'instituicoes'), {
                instituicao,
                codigo: codigo.toUpperCase()
            })
            setInstituicao('')
            alert('Instituição criada com sucesso.')
        } catch (err) {
            alert('Ocorre um erro ao tentar criar a nova instituição')
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-10">
            <h2 className="mt-5 text-center" >Nova Instituição</h2>
            <form
                className=""
                onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label
                        className="font-semibold"
                        htmlFor="instituicao">Nova Instituição</label>
                    <input
                        className="border p-2 outline-0 mb-2"
                        type="text"
                        name="instituicao"
                        value={instituicao}
                        onChange={e => setInstituicao(e.target.value)} />
                </div>

                <div className="flex flex-col">
                    <label
                        className="font-semibold"
                        htmlFor="codigo">Código</label>
                    <input
                        className="border p-2 outline-0 mb-2"
                        type="text"
                        name="codigo"
                        value={codigo}
                        onChange={e => setCodigo(e.target.value)} />
                </div>

                <div className="flex flex-col">
                    {!loading ?
                        <input
                            className="cursor-pointer mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-green-700 transition delay-150 ease-in-out hover:bg-green-900 font-bold"
                            type="submit"
                            value="Salvar" />
                        :
                        <input
                            className="mt-2 mx-auto flex  w-4/12 md:w-2/12  items-center justify-center gap-1 p-2 bg-gray-500 font-bold"
                            type="submit"
                            disabled
                            value="Salvar" />
                    }
                </div>
            </form>
        </div>
    )
}