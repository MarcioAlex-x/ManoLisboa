import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user){
        setUserData(null)
        setLoading(false)
        return
      }

      const docRef = doc(db, 'usuarios', user.uid)
      const snapshot = await getDoc(docRef)

      let profileData = null

      if(snapshot.exists()){
        profileData = snapshot.data()
      }

      setUserData({
        uid: user.uid,
        email: user.email,
        ...profileData
      })

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  )
}

