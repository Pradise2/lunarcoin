// src/firestoreFunctions.js
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore"; 
import axios from 'axios';
// Utility function to update user count for a specific collection
const updateUserCount = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const collectionSnapshot = await getDocs(collectionRef);
  const userCount = collectionSnapshot.size;

  await setDoc(doc(db, "UserCount", collectionName), {
    userCount: userCount
  });
};

// Home Collection Functions
export const addUserToHome = async (userId, userData) => {
  await setDoc(doc(db, "Home", userId.toString()), userData);
};

export const getUserFromHome = async (userId) => {
  const docRef = doc(db, "Home", userId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

// Tasks Collection Functions
export const addUserTasks = async (userId, tasks) => {
  await setDoc(doc(db, "Tasks", userId.toString()), tasks);
  await updateUserCount("Tasks");
};

export const getUserTasks = async (userId) => {
  const docRef = doc(db, "Tasks", userId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

// Special Collection Functions
export const addUserStasks = async (userId, stasks) => {
  await setDoc(doc(db, "Stasks", userId.toString()), stasks);
  await updateUserCount("Stasks");
};

export const getUserStasks = async (userId) => {
  const docRef = doc(db, "Stasks", userId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};



// Farm Collection Functions
export const addUserToFarm = async (userId, farmData) => {
  try {
    const response = await axios.post('https://lunarapp.thelunarcoin.com/backend/api/farm/add', { userId, farmData });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding user to farm:", error);
    return null;
  }
};

export const getUserFromFarm = async (userId) => {
  try {
    const response = await axios.get(`https://lunarapp.thelunarcoin.com/backend/api/farm/${userId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error getting user from farm:", error);
    return null;
  }
};


// Squad Collection Functions
export const addUserToSquad = async (userId, squadData) => {
  await setDoc(doc(db, "Squad", userId.toString()), squadData);
};

export const getUserFromSquad = async (userId) => {
  const docRef = doc(db, "Squad", userId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

// Function to get user count from the UserCount collection
export const getUserCount = async (collectionName) => {
  const countDocRef = doc(db, "UserCount", collectionName);
  const countDocSnap = await getDoc(countDocRef);

  if (countDocSnap.exists()) {
    return countDocSnap.data().userCount;
  } else {
    console.log("No such document!");
    return 0;
  }
};
