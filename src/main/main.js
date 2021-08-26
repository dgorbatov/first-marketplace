import "./main.css";
import Navbar from "./navbar/navbar";
import Account from "./account/account";
import Sell from "./sell/sell";
import Buy from "./buy/buy";
import Item from "./item/item";
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

  function setSearchCallback(query) {
    setSearch(query);
  }

  useEffect(() => {
    onAuthStateChanged(auth, async user => {
      setUser(user);
      if (user) {
        const docSnap = await getDoc(doc(db, "user-info", user.uid));
        setUserData(docSnap.data());
      }
    });
  }, []);

  return (
    <div className="main">
      <Navbar searchCallback={setSearchCallback}
              authState={user !== null}
              country={userData !== null ? userData.country.value : ""}/>
      <Switch>
        <Route path="/ms/buy" exact>
          <Buy query={search}
               country={userData !== null ? userData.country.value : ""}/>
        </Route>

        <Route path="/ms/item/:id" exact>
          <Item />
        </Route>

        <Route path="/ms/sell/">
          <Sell authState={user !== null} user={user} data={userData}/>
        </Route>

        <Route path="/ms/account" exact>
          <Account authState={user !== null}/>

        </Route>

        <Route path="*" exact>
          <Redirect to="/error/404" />
        </Route>
      </Switch>
    </div>
  );
}

export default Main;