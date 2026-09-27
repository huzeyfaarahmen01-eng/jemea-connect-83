import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAZwq0Tdy7sPfMVRUJUEQ1PDXi3QchPplA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jemeawebsite.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jemeawebsite",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jemeawebsite.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "539725907300",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:539725907300:web:d2a96ffada447779f56671",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-H4YZ8F86J5",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth =
  typeof window === "undefined"
    ? initializeAuth(app, { persistence: inMemoryPersistence })
    : getAuth(app);
export const db = getFirestore(app);
