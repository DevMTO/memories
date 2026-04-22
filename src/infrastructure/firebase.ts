import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// ✅ CRITICAL: These are server-side variables, only available in Node.js context
// They are NOT available in the browser and will be undefined during SSG builds
// during which Firebase initialization may fail (use fallback)

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

let db: any = null;
let isInitialized = false;

try {
  if (!getApps().length) {
    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      isInitialized = true;
      console.log('✅ Firebase Admin SDK initialized successfully');
    } else {
      console.warn(
        '⚠️ Firebase Admin SDK credentials missing. Environment variables not found:\n' +
        `  - FIREBASE_PROJECT_ID: ${projectId ? '✓' : '✗'}\n` +
        `  - FIREBASE_CLIENT_EMAIL: ${clientEmail ? '✓' : '✗'}\n` +
        `  - FIREBASE_PRIVATE_KEY: ${privateKey ? '✓' : '✗'}`
      );
      // Initialize with a dummy config to prevent crashes
      initializeApp({ projectId: 'dummy-project' });
    }
    db = getFirestore();
  } else {
    db = getFirestore();
    isInitialized = true;
  }
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error);
  // Create a dummy db to prevent crashes
  initializeApp({ projectId: 'dummy-project' });
  db = getFirestore();
}

export { db, isInitialized };
