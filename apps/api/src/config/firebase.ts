import admin from "firebase-admin";
import { loadEnv } from "./env.js";

let firebaseApp: admin.app.App | null = null;

export function initializeFirebase() {
  if (firebaseApp) return firebaseApp;

  const env = loadEnv();

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey,
      projectId: env.firebaseProjectId,
    }),
  });

  return firebaseApp;
}

export const getFirestore = () => {
  const app = initializeFirebase();
  return app.firestore();
};

export const getAuth = () => {
  const app = initializeFirebase();
  return app.auth();
};
