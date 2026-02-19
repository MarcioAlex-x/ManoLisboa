import { useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"

export const ProtectedRoute = ({ children }) => {
    const { userData, loading } = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !userData) {
            navigate('/login')
        }

    }, [userData, navigate, loading])

    if(loading) return <span className="loader"></span>

    if(!userData) return null

    return children
}
