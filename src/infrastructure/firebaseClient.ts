import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || 'example-project-a85a0',
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || 'fake-api-key',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || 'example-project-a85a0.firebaseapp.com',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || 'example-project-a85a0.firebasestorage.app',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '929871652293',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '1:929871652293:web:5b3503b3ea02eea06697ac'
};

// Initialize Firebase only once
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
