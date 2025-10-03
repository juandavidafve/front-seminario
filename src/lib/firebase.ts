import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import store from "@/redux/store";
import { getAccountInfo } from "@/services/user";

import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
} from "./config";

const app = initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
});

const auth = getAuth(app);

auth.onAuthStateChanged(async (user) => {
  if (user) {
    const info = await getAccountInfo();
    store.dispatch({
      type: "auth/login",
      payload: info,
    });
  } else {
    store.dispatch({
      type: "auth/logout",
    });
  }
});

export default app;
export { auth };
