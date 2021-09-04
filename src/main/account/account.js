import "./account.css";
import config from "../../extra/config"
import { getAuth, signOut } from "firebase/auth";
import { initializeApp  } from "firebase/app";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { doc, getFirestore, updateDoc } from "@firebase/firestore";
import { Icon } from '@iconify/react';
import { getDoc, setDoc } from "firebase/firestore";

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
  const [page, setPage] = useState("Settings");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [ptExists, setPTExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const setting = "Settings";
  const pt = "Public Team";

  useState(async () => {
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

    const docSnap = await getDoc(doc(db, "user-info/" + props.user.uid + "/profile/info"));

    if (docSnap.exists()) {
      setCity(docSnap.data().city);
      setDescription(docSnap.data().description);
      setPTExists(true);
    }

    setLoading(false);
  }, [signOutAccount]);

  async function saveChanges() {
    setLoading(true);
    if (!ptExists && page === pt) {
      await setDoc(doc(db, "user-info/" + props.user.uid + "/profile/info"), {
        name: name,
        "num-mem": numTeam,
        comp: userData.program,
        number: userData.number,
        country: userData.country.label,
        city: city,
        creat: userData["team-creation-year"],
        description: description,
        pfp: pfp
      });
      setPTExists(true);
    } else if (page === pt) {
      await updateDoc(doc(db, "user-info/" + props.user.uid + "/profile/info"), {
        city: city,
        description: description,
      });
    } else if (page === setting) {
      await updateDoc(doc(db, "user-info", props.uid), {
        name: name,
        "num-mem": numTeam,
        mode: props.mode
      });

      if (ptExists) {
        await updateDoc(doc(db, "user-info/" + props.user.uid + "/profile/info"), {
          name: name,
          "num-mem": numTeam,
          mode: props.mode
        });
      }
    }

    setLoading(false);
  }

  return (
    <div className={props.mode === "l" ? "account light-account" : "account dark-account"}>
      {loading ? <Icon icon="eos-icons:bubble-loading" height="30vh" width="30vw" className="loading"/>
      : <div className="account">
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
        <h1>{page}:</h1>
        { page === setting &&
          <div>
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
              <button onClick={() => setNumTeam(numTeam - 1)}><p>-</p></button>
              <p>{numTeam}</p>
              <button onClick={() => setNumTeam(numTeam + 1)}><p>+</p></button>
            </section>

            <section>
              <h2>Team Name:</h2>
              <input type="text" placeholder="Team Name" value={name}
                onChange={val => setName(val.target.value)}/>
            </section>
          </div>
        }

        { page === pt &&
          <div className="pt">
            <h2>Name: <p>{userData !== null ? userData.name : ""}</p></h2>
            <h2>Competition: <p>{userData !== null ? userData.program : ""}</p></h2>
            <h2>Team Num: <p>{userData !== null ? userData.number : ""}</p></h2>
            <h2>Country: <p>{userData !== null ? userData.country.label : ""}</p></h2>
            <h2>Num Team Members: <p>{userData !== null ? userData["num-mem"] : ""}</p></h2>
            <h2>Team Creation Year: <p>{userData !== null ? userData["team-creation-year"] : ""}</p></h2>


            <section>
              <h2>Team Description:</h2>
              <input type="text" placeholder="Team Description" value={description}
                onChange={val => setDescription(val.target.value)}/>
            </section>

            <section>
              <h2>Team City/State:</h2>
              <input type="text" placeholder="Team City/State" value={city}
                onChange={val => setCity(val.target.value)}/>
            </section>
          </div>
        }

        {page !== pt && <button onClick={async () => {
                                await signOut(auth);
                                setSignOutAccount(true);
                                history.push("/");
        } }>Sign Out</button> }

      <button onClick={saveChanges} className="save-changes">{(!ptExists && page === pt) ?
                                                                "Create Team" :
                                                                "Save Changes"}
      </button>
    </article>

    <article className="links">
      <article>
        <p onClick={() => setPage(setting)}>Settings</p>
        { page === setting && <hr />}
      </article>

      <article>
        <p onClick={() => setPage(pt)}>Public Team</p>
        { page === pt && <hr />}
      </article>
    </article>
    </div> }
    </div>
  );
}

export default Account;