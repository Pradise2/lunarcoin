// src/firestoreFunctions.js
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore"; 

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

// Farm Collection Functions
export const addUserToFarm = async (userId, farmData) => {
  await setDoc(doc(db, "Farm", userId.toString()), farmData);
  await updateUserCount("Farm");
};

export const getUserFromFarm = async (userId) => {
  const docRef = doc(db, "Farm", userId.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

export const updateFarmBalance = async (userId, newBalance) => {
  const userRef = doc(db, "Farm", userId.toString());
  await updateDoc(userRef, {
    FarmBalance: newBalance,
  });
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
