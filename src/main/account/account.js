import "./account.css";
import config from "../../extra/config"
import { getAuth, signOut } from "firebase/auth";
import { initializeApp  } from "firebase/app";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { doc, getFirestore, updateDoc } from "@firebase/firestore";

initializeApp(config);
const auth = getAuth();
const db = getFirestore();

function Account(props) {
  const history = useHistory();
  const [signOutAccount, setSignOutAccount] = useState(false);

  useState(() => {
    if (!props.authState) {
      history.push("/ss/ls/login");
    } else if (signOutAccount) {
      history.push("/");
    }
  }, [signOutAccount]);

  async function saveChanges() {
    await updateDoc(doc(db, "user-info", props.uid), {
      mode: props.mode
    });
  }

  return (
    <div className={props.mode === "l" ? "account light-account" : "account dark-account"}>
      <h1>This page is not fully available yet. If you need help with your account
          please contact us at contact.firstmarketplace@gmail.com
      </h1>
      <button onClick={() => props.modeCallback("d")}>Dark Mode</button>
      <button onClick={() => props.modeCallback("l")}>Light Mode</button>

      <button onClick={async () => {
                               await signOut(auth);
                               setSignOutAccount(true);
                               history.push("/");
      } }>Sign Out!</button>

    <button onClick={saveChanges}>Save Changes</button>

    </div>
  );
}

export default Account;