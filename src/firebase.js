import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey:"AIzaSyA8Y8FbQK6FAZMWjeXj8Cs_RcRBhU7FayA",

  authDomain: "eco-carbon-app.firebaseapp.com",

  projectId: "eco-carbon-app",

  storageBucket: "eco-carbon-app.appspot.com",

  messagingSenderId: "238633380943",

  appId: "1:238633380943:web:......"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);