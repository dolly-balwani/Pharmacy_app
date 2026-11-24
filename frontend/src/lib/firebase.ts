import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY.trim().length > 10 &&
  !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("MockDemoKey")
);

const firebaseConfig = {
  apiKey: isFirebaseConfigured 
    ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY! 
    : "AIzaSyMockDemoKeyForBuildMediBid2026",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "medibid-ai.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "medibid-ai",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "medibid-ai.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Initialize Firebase safely on both client and SSR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    // Development fallback if real Firebase keys have not been pasted yet
    return {
      success: true,
      user: { email: 'patient.google@medibid.ai', displayName: 'Google Verified Patient' },
      token: 'mock-firebase-id-token'
    };
  }

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

declare global {
  interface Window {
    recaptchaVerifier?: any;
    confirmationResult?: ConfirmationResult;
  }
}

export function initRecaptcha(containerId: string = 'recaptcha-container') {
  if (typeof window === 'undefined') return null;
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {},
    });
  }
  return window.recaptchaVerifier;
}

export async function sendFirebasePhoneOtp(phoneNumber: string, containerId: string = 'recaptcha-container') {
  try {
    const appVerifier = initRecaptcha(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return {
      success: true,
      confirmationResult,
    };
  } catch (error: any) {
    console.error("Firebase Phone SMS Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function verifyFirebasePhoneOtp(code: string, confirmationResult?: ConfirmationResult) {
  try {
    const activeConfirmation = confirmationResult || window.confirmationResult;
    if (!activeConfirmation) {
      throw new Error("No active OTP session found. Please request a new code.");
    }
    const result = await activeConfirmation.confirm(code);
    const token = await result.user.getIdToken();
    return {
      success: true,
      user: result.user,
      token,
    };
  } catch (error: any) {
    console.error("Firebase OTP Verification Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
