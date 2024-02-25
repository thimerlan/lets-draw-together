import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "",
  authDomain: "task6-6f17a.firebaseapp.com",
  projectId: "task6-6f17a",
  storageBucket: "task6-6f17a.appspot.com",
  messagingSenderId: "759464606675",
  appId: "1:759464606675:web:f7ef9724dd45ceb7ae4d26",
  measurementId: "G-L43T7J82W0",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const boardsDB = getDatabase(app);
export default app;
