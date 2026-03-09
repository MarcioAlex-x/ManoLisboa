import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setUserData(null)
        setAuthError(null)
        setLoading(false)
        return
      }

      try {

        const docRef = doc(db, 'usuarios', user.uid)
        const snapshot = await getDoc(docRef)

        if (!snapshot.exists()) {
          setAuthError("Usuário não encontrado no sistema")
          await signOut(auth)
          setUserData(null)
          setLoading(false)
          return
        }

        const profileData = snapshot.data()
        const hoje = new Date()

        if (!profileData.ativo) {
          setAuthError("Sua conta está desativada. Entre em contato com o administrador.")
          await signOut(auth)
          setUserData(null)
          setLoading(false)
          return
        }

        if (profileData.ativoAte) {

          const dataExp = profileData.ativoAte.toDate
            ? profileData.ativoAte.toDate()
            : new Date(profileData.ativoAte)

          if (hoje > dataExp) {
            setAuthError("Seu acesso ao sistema expirou.")
            await signOut(auth)
            setUserData(null)
            setLoading(false)
            return
          }

        }

        setAuthError(null)

        setUserData({
          uid: user.uid,
          email: user.email,
          ...profileData
        })

      } catch (err) {
        console.error(err)
        setAuthError("Erro ao verificar dados do usuário")
        setUserData(null)
      }

      setLoading(false)

    })

    return unsubscribe

  }, [])

  return (
    <UserContext.Provider value={{ userData, loading, authError }}>
      {children}
    </UserContext.Provider>
  )
}