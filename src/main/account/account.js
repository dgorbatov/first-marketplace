import "./account.css";
import config from "../../extra/config"
import { getAuth, signOut } from "firebase/auth";
import { initializeApp  } from "firebase/app";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { doc, getFirestore, updateDoc } from "@firebase/firestore";
import { Icon } from '@iconify/react';

initializeApp(config);
const auth = getAuth();
const db = getFirestore();

function Account(props) {
  const history = useHistory();
  const [signOutAccount, setSignOutAccount] = useState(false);
  const [pfp, setPfp] = useState("");
  const [userData, setUserData] = useState(null);
  const [numTeam, setNumTeam] = useState(0);
  const [name, setName] = useState("");

  useState(() => {
    if (!props.authState) {
      history.push("/ss/ls/login");
    } else if (signOutAccount) {
      history.push("/");
    }
    setPfp(props.user.photoURL);
    setUserData(props.userData);

    if (props.userData !== null) {
      setNumTeam(parseInt(props.userData["num-mem"]))
      setName(props.userData.name);
    }
  }, [signOutAccount]);

  async function saveChanges() {
    console.log("UPDATE");
    await updateDoc(doc(db, "user-info", props.uid), {
      name: name,
      "num-mem": numTeam,
      mode: props.mode
    });
  }

  return (
    <div className={props.mode === "l" ? "account light-account" : "account dark-account"}>
      <article className="profile">
        <section className="pfp">
          { pfp !== null ? <img src={pfp} alt="PFP" /> :
                           <Icon icon="whh:profile" className="default-pfp" height= "25vh"/> }
          <p>{userData !== null ? userData.name : ""}</p>
        </section>

        <section className="profile-info">
          <h1>Info:</h1>
          <h2>Competition: <p>{userData !== null ? userData.program : ""}</p></h2>
          <h2>Team Num: <p>{userData !== null ? userData.number : ""}</p></h2>
          <h2>Country: <p>{userData !== null ? userData.country.label : ""}</p></h2>
          <h2>Num Team Members: <p>{userData !== null ? userData["num-mem"] : ""}</p></h2>
          <h2>Team Creation Year: <p>{userData !== null ? userData["team-creation-year"] : ""}</p></h2>
        </section>
      </article>
      <article className="settings">
        <h1>Settings:</h1>

        <section>
          <h2>Theme:</h2>

          <article>
            <input type="radio" name="theme" checked={props.mode === "l"}
              onChange={() => props.modeCallback("l") }/>
            <label>Light</label>
          </article>

          <article>
            <input type="radio" name="theme" checked={props.mode === "d"}
              onChange={() => props.modeCallback("d")}/>
            <label>Dark</label>
          </article>
        </section>

        <section>
          <h2>Num Team Members:</h2>
          <button onClick={() => setNumTeam(numTeam - 1)}>-</button>
          <p>{numTeam}</p>
          <button onClick={() => setNumTeam(numTeam + 1)}>+</button>
        </section>

        <section>
          <h2>Team Name:</h2>
          <input type="text" placeholder="Team Name" value={name}
            onChange={val => setName(val.target.value)}/>
        </section>

        <button onClick={async () => {
                                await signOut(auth);
                                setSignOutAccount(true);
                                history.push("/");
        } }>Sign Out</button>

      <button onClick={saveChanges} className="save-changes">Save Changes</button>
    </article>

    </div>
  );
}

export default Account;