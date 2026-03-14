import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

function initFirebase() {

    if (!getApps().length) {

        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
            : null

        if (!serviceAccount) {
            throw new Error("Missing FIREBASE_SERVICE_ACCOUNT")
        }

        initializeApp({
            credential: cert(serviceAccount)
        })
    }

    return getFirestore()
}

export const db = initFirebase()
