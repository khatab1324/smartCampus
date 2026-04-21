import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function requireFirebaseEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing Firebase env variable: ${name}`);
  }

  return value;
}

const firebaseConfig = {
  apiKey: requireFirebaseEnv(process.env.EXPO_PUBLIC_FIREBASE_API_KEY, "EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain: requireFirebaseEnv(
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  ),
  projectId: requireFirebaseEnv(
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  ),
  storageBucket: requireFirebaseEnv(
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  ),
  messagingSenderId: requireFirebaseEnv(
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  ),
  appId: requireFirebaseEnv(process.env.EXPO_PUBLIC_FIREBASE_APP_ID, "EXPO_PUBLIC_FIREBASE_APP_ID"),
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = (() => {
  try {
    return initializeAuth(app);
  } catch {
    return getAuth(app);
  }
})();

export const db = getFirestore(app);
