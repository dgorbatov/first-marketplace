import "./main.css";
import { Link } from "react-router-dom"
import Navbar from "./navbar/navbar";
import Account from "./account/account";
import { Route } from "react-router-dom";

function Main() {

  return (
    <div className="main">
      <Navbar />

      <Route path="/ms/buy" exact>

      </Route>

      <Route path="/ms/sell" exact>

      </Route>

      <Route path="/ms/account" exact>
        <Account />
      </Route>
    </div>
  );
}

export default Main;