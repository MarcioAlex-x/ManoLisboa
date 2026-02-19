import { useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"

export const AdminRoute = ({ children }) => {
    const { userData, loading } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {

        if (!loading && userData?.tipo !== 'admin') {
            navigate('/login')
        }

    }, [userData, navigate, loading])

    if(loading) return <span className="loader"></span>

    if(!userData) return null

    return children
}
