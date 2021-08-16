import "./sell.css";
import Menu from "./menu/menu";
import Add from "./add/add";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";

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

function Sell() {
  const history = useHistory();

  onAuthStateChanged(auth, async user => {
    if (!user) {
      history.push("/ss/ls/login");
    }
  });

  return (
    <div className="sell">
      <Switch>
        <Route path="/ms/sell/menu" exact>
          <Menu />
        </Route>

        <Route path="/ms/sell/sell-item/:id" exact>
          <Add />
        </Route>

        <Route path="*" exact>
          <Redirect to="/error/404" />
        </Route>
      </Switch>
    </div>
  );
}

export default Sell;