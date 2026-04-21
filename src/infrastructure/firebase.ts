import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = import.meta.env.FIREBASE_PROJECT_ID;
const clientEmail = import.meta.env.FIREBASE_CLIENT_EMAIL;
const privateKey = import.meta.env.FIREBASE_PRIVATE_KEY;

if (!getApps().length) {
  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    console.warn('⚠️ Variables de entorno de Firebase Admin (FIREBASE_PROJECT_ID, etc.) no encontradas. Saltando inicialización del Admin SDK.');
    // Initialize with a dummy config just so getFirestore() doesn't completely crash the build
    initializeApp({ projectId: 'dummy-project' });
  }
}

export const db = getFirestore();
