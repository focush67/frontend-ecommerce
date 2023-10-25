import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET || "admin-panel-20-oct.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGER,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const categoryConfig = {
  apiKey: "AIzaSyBAruxlNWXyaxHrpCTcVUe4N59xoF7nChg",
  authDomain: "categories-admin-panel.firebaseapp.com",
  projectId: "categories-admin-panel",
  storageBucket: "categories-admin-panel.appspot.com",
  messagingSenderId: "455030907006",
  appId: "1:455030907006:web:0e1f2869e0835061ea782f"
};

const productApp = initializeApp(firebaseConfig,"products");
const categoryApp = initializeApp(categoryConfig,"categories");
export const productStorage = getStorage(productApp);
export const categoryStorage = getStorage(categoryApp);