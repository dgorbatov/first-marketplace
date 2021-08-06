import "./account.css";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth();

function Account() {
  return (
    <div className="account">
      <h1>This Page Is Currently For Testing Purposes ONLY</h1>
      <button onClick={() => { signOut(auth).then(() => {console.log("SIGNED OUT"); }); }}>SIGN OUT</button>
    </div>
  );
}

export default Account;