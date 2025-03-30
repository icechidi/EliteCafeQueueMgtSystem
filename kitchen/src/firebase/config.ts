import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDGCxK9NhVLTFqL_HEFPFTc0HHHNZWjqzk",
  authDomain: "icechidi-d00ab.firebaseapp.com",
  projectId: "icechidi-d00ab",
  storageBucket: "icechidi-d00ab.appspot.com",
  messagingSenderId: "547891234567",
  appId: "1:547891234567:web:abc123def456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);