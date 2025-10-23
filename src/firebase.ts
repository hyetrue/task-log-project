// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBPpr0wiKRROWq56YhYTHSTEMuB6u-TQY4',
  authDomain: 'task-log-project.firebaseapp.com',
  projectId: 'task-log-project',
  storageBucket: 'task-log-project.firebasestorage.app',
  messagingSenderId: '73656147915',
  appId: '1:73656147915:web:c8ebb19097030a078aa04e',
  measurementId: 'G-MLFEBGX1JG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
