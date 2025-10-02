import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import store from "@/redux/store";

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

auth.onAuthStateChanged((user) => {
  if (user) {
    store.dispatch({
      type: "auth/login",
      payload: {
        name: user.displayName,
        email: user.email,
      },
    });
  } else {
    store.dispatch({
      type: "auth/logout",
    });
  }
});

export default app;
export { auth };
