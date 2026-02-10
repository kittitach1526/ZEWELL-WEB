import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../key.json';

// Initialize Firebase Admin
if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount as any),
    });
}

const db = getFirestore();

export { db };
