import "./account.css";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp  } from "firebase/app";
import { useHistory } from "react-router-dom";
import { useState } from "react";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHRkVZq1gWEQ4kWLsV--PjSdc2udL1kX4",
  authDomain: "firstmarketplace-d3d3b.firebaseapp.com",
  databaseURL: "https://firstmarketplace-d3d3b-default-rtdb.firebaseio.com",
  projectId: "firstmarketplace-d3d3b",
  storageBucket: "firstmarketplace-d3d3b.appspot.com",
  messagingSenderId: "506337230664",
  appId: "1:506337230664:web:7355588d6370176d6a3d7d",
  measurementId: "G-R8M8TSPN42"
};
initializeApp(firebaseConfig);
const auth = getAuth();

function Account() {
  const history = useHistory();
  const [signOutAccount, setSignOutAccount] = useState(false);

  onAuthStateChanged(auth, async user => {
    if (!user && !signOutAccount) {
      history.push("/ss/ls/login");
    } else if (!user) {
      history.push("/");
    }
  });

  return (
    <div className="account">
      <h1>This page is not available yet. If you need help with your account
          please contact us at contact.firstmarketplace@gmail.com
      </h1>
      <button onClick={() => { setSignOutAccount(true); signOut(auth);} }>Sign Out!</button>
    </div>
  );
}

export default Account;