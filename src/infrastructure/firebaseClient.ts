import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Use public variables if you want them on the client side, but since it's an admin panel
  // we can use PUBLIC_ prefixes so Astro exposes them to the client-side React.
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || 'example-project-a85a0',
  // You would typically add apiKey, authDomain, etc., here for standard Firebase Web SDK setup.
  // We mock a standard setup structure assuming those would be provided for Auth.
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || 'fake-api-key',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || 'example-project-a85a0.firebaseapp.com',
};

// Initialize Firebase only once
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
