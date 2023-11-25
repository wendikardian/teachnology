// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps} from "firebase/app";
import  { getAuth,initializeAuth } from "firebase/auth";
import {getReactNativePersistence} from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getDatabase} from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import {FB_API_KEY,
  FB_AUTH_DOMAIN,
  FB_PROJECT_ID,
  FB_STORAGE_BUCKET,
  FB_MSG_SENDER_ID,
  FB_APP_ID,
  FB_MEASUREMENT_ID,
  FB_DB_URL} from '@env'


// const firebaseConfig = {
//   apiKey: FB_API_KEY,
//   authDomain: FB_AUTH_DOMAIN,
//   projectId: FB_PROJECT_ID,
//   storageBucket: FB_STORAGE_BUCKET,
//   messagingSenderId: FB_MSG_SENDER_ID,
//   appId: FB_APP_ID,
//   measurementId: FB_MEASUREMENT_ID,
//   databaseURL: FB_DB_URL,
// };
const firebaseConfig = {
  apiKey: "AIzaSyCqnGGmV0_qwaeSzrpre8jTIsstE0Q7LsE",
  authDomain: "coffe-shop-4b039.firebaseapp.com",
  projectId: "coffe-shop-4b039",
  storageBucket: "coffe-shop-4b039.appspot.com",
  messagingSenderId: "347736473199",
  appId: "1:347736473199:web:bd00ba1871cc5312a6179a",
  measurementId: "G-5XRD27YJHS",
  databaseURL: "https://coffe-shop-4b039-default-rtdb.firebaseio.com",
};
let ath;

let app:any;
// Initialize Firebase
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    ath = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  ath = getAuth(app);
}
const auth = getAuth(app)
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app)
export default auth;