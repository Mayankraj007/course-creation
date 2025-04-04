
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCJVpsDBeOhB4sHQZC1_X14uR078UMxNNM",
    authDomain: "course-app-project-86ac7.firebaseapp.com",
    projectId: "course-app-project-86ac7",
    storageBucket: "course-app-project-86ac7.firebasestorage.app",
    messagingSenderId: "79892939452",
    appId: "1:79892939452:web:2d25c01edbbdbd30b8c6b9",
    measurementId: "G-QEMS7ZP0PE"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
