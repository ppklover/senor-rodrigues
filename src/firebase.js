import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBS6ZmZ7PP_Og8tAOHFvFGadmh213jJ_Yw",
  authDomain: "barbearia-senorrodrigues.firebaseapp.com",
  projectId: "barbearia-senorrodrigues",
  storageBucket: "barbearia-senorrodrigues.firebasestorage.app",
  messagingSenderId: "354869185125",
  appId: "1:354869185125:web:156497774eb4871836548c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
