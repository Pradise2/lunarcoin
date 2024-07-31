// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 

const firebaseConfig = {
    apiKey: "AIzaSyAMXy8cfauXHzfhHIp3bDAOP-nFLM6xrHs",
    authDomain: "thel-ed136.firebaseapp.com",
    projectId: "thel-ed136",
    storageBucket: "thel-ed136.appspot.com",
    databaseURL: "https://thel-ed136-default-rtdb.firebaseio.com",
    messagingSenderId: "18007041500",
    appId: "1:18007041500:web:182cb1eb7e039968165b19",
    measurementId: "G-BYHJQDVC2Y"
  
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };


