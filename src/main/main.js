import "./main.css";
import Navbar from "./navbar/navbar";
import Account from "./account/account";
import Sell from "./sell/sell";
import Buy from "./buy/buy";
import Item from "./item/item";
import { Icon } from '@iconify/react';
import { Redirect, Route, Switch } from "react-router-dom";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

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
const db = getFirestore();

function Main() {
  const [search, setSearch] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      setUser(user);
      if (user) {
        const docSnap = await getDoc(doc(db, "user-info", user.uid));
        setUserData(docSnap.data());
        setMode(docSnap.data().mode);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className={(userData !== null && mode === "l") ? "main light-main" : "main dark-main"}>
      {loading ? <Icon icon="eos-icons:bubble-loading" height="30vh" width="30vw" className="loading"/>
      : <div>
      <Navbar searchCallback={setSearch}
              authState={user !== null}
              country={userData !== null ? userData.country.value : ""}
              mode={userData !== null ? mode : "d"}/>
      <Switch>
        <Route path="/ms/buy" exact>
          <Buy query={search}
               country={userData !== null ? userData.country.label : ""}
               mode={userData !== null ? mode : "d"}/>
        </Route>

        <Route path="/ms/item/:id" exact>
          <Item mode={userData !== null ? mode : "d"}/>
        </Route>

        <Route path="/ms/sell/">
          <Sell authState={user !== null}
                user={user}
                data={userData}
                mode={userData !== null ? mode : "d"}/>
        </Route>

        <Route path="/ms/account" exact>
          <Account authState={user !== null}
                   mode={userData !== null ? mode : "d"}
                   modeCallback={setMode}
                   uid={user ? user.uid : undefined}
          />
        </Route>

        <Route path="*" exact>
          <Redirect to="/error/404" />
        </Route>
      </Switch>
      </div> }
    </div>
  );
}

export default Main;