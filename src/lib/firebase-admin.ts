import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
let serviceAccount: any;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } else {
        // Fallback for local development when .env lacks the variable but key.json is present
        serviceAccount = require('../key.json');
    }
} catch (error) {
    console.warn("Could not load Firebase service account locally or from environment.", error);
    // Vercel might crash if this is missing for SSR, but we provide a warning.
}

// Initialize Firebase Admin
if (!getApps().length && serviceAccount) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();

export { db };
