import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyMockDemoKeyForMediBid2026",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "medibid-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "medibid-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "medibid-ai.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Initialize Firebase safely on both client and server
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    return {
      success: true,
      user: result.user,
      token,
    };
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
