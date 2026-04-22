import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ✅ For SSG/SSR builds, Firebase Admin may not be available
// We handle this gracefully by checking if we're in a server context
// and if credentials are available

let db: any = null;
let isInitialized = false;

try {
  // Check if we're in a Node.js context (not browser)
  if (typeof process !== 'undefined' && process.env) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!getApps().length) {
      if (projectId && clientEmail && privateKey) {
        try {
          initializeApp({
            credential: cert({
              projectId,
              clientEmail,
              privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
          });
          isInitialized = true;
          console.log('✅ Firebase Admin SDK initialized successfully with credentials');
        } catch (credError) {
          console.warn('⚠️ Firebase Admin SDK credential initialization failed:', credError);
        }
      } else {
        console.warn(
          '⚠️ Firebase Admin SDK credentials missing. Ensure these env vars are set:\n' +
          `  • FIREBASE_PROJECT_ID\n` +
          `  • FIREBASE_CLIENT_EMAIL\n` +
          `  • FIREBASE_PRIVATE_KEY`
        );
      }
      
      // Always get Firestore instance, fallback to dummy if init failed
      if (!getApps().length) {
        initializeApp({ projectId: 'dummy-project' });
      }
      db = getFirestore();
    } else {
      db = getFirestore();
      isInitialized = true;
    }
  } else {
    // Browser context - Firebase Admin cannot be used
    console.warn('⚠️ Not in Node.js context. Firebase Admin SDK unavailable.');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', (error as Error).message);
  try {
    if (!getApps().length) {
      initializeApp({ projectId: 'dummy-project' });
    }
    db = getFirestore();
  } catch (fallbackError) {
    console.error('❌ Even fallback initialization failed');
  }
}

export { db, isInitialized };
