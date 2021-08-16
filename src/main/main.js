import "./main.css";
import Navbar from "./navbar/navbar";
import Account from "./account/account";
import Sell from "./sell/sell";
import { Redirect, Route, Switch } from "react-router-dom";

function Main() {

  return (
    <div className="main">
      <Navbar />
      <Switch>
        <Route path="/ms/buy" exact>
          <p>Buy Page!</p>
        </Route>

        <Route path="/ms/sell/">
          <Sell />
        </Route>

        <Route path="/ms/account" exact>
          <Account />

        </Route>

        <Route path="*" exact>
          <Redirect to="/error/404" />
        </Route>
      </Switch>
    </div>
  );
}

export default Main;