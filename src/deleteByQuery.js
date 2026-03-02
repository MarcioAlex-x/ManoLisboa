import { getDocs, limit, query, writeBatch } from "firebase/firestore"
import { db } from "./firebaseConfig"

export const deleteByQuery = async (queryRef) => {
  while (true) {
    const snapshot = await getDocs(query(queryRef, limit(500)))

    if (snapshot.empty) break

    const batch = writeBatch(db)

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    await batch.commit()
  }
}