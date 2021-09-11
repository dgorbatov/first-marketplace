import "./main.css";
import Navbar from "./navbar/navbar";
import Account from "./account/account";
import Sell from "./sell/sell";
import Buy from "./buy/buy";
import Item from "./item/item";
import Team from "./team/team";
import { Icon } from '@iconify/react';
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import config from "../extra/config";

initializeApp(config);
const auth = getAuth();
const db = getFirestore();

function Main() {
  const history = useHistory();
  const [search, setSearch] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      setUser(user);
      if (user) {
        onSnapshot(doc(db, "user-info", user.uid), docSnap => {
          setLoading(true);
          if (!docSnap.exists()) {
            history.push("/ss/info")
            return;
          }
          setUserData(docSnap.data());
          setMode(docSnap.data().mode);
          setLoading(false);
        }, err => {});
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [history]);

  return (
    <div className={(userData !== null && mode === "d") ? "main dark-main" : "main light-main"}>
      {loading ? <Icon icon="eos-icons:bubble-loading" height="30vh" width="30vw" className="loading"/>
      : <div>
      <Navbar searchCallback={setSearch}
              authState={user !== null}
              country={userData !== null ? userData.country.value : ""}
              mode={userData !== null ? mode : "l"}/>
      <Switch>
        <Route path="/ms/buy" exact>
          <Buy query={search}
               country={userData !== null ? userData.country.label : ""}
               mode={userData !== null ? mode : "l"}/>
        </Route>

        <Route path="/ms/item/:id" exact>
          <Item mode={userData !== null ? mode : "l"}/>
        </Route>

        <Route path="/ms/sell/">
          <Sell authState={user !== null}
                user={user}
                data={userData}
                mode={userData !== null ? mode : "l"}/>
        </Route>

        <Route path="/ms/account" exact>
          <Account authState={user !== null}
                   mode={userData !== null ? mode : "l"}
                   modeCallback={setMode}
                   uid={user ? user.uid : undefined}
                   user={user}
                   userData = {userData}
          />
        </Route>

        <Route path="/ms/team/:id" exact>
          <Team />
        </Route>


        <Route path="*" exact>
          <Redirect to="/error/404"/>
        </Route>
      </Switch>
      </div> }
    </div>
  );
}

export default Main;