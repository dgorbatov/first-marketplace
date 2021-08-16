import "./main.css";
import Navbar from "./navbar/navbar";
import Account from "./account/account";
import Sell from "./sell/sell";
import Buy from "./buy/buy";
import { Redirect, Route, Switch } from "react-router-dom";
import { useState } from "react";

function Main() {
  const [search, setSearch] = useState(null);

  function setSearchCallback(query) {
    setSearch(query);
  }

  return (
    <div className="main">
      <Navbar searchCallback={setSearchCallback}/>
      <Switch>
        <Route path="/ms/buy" exact>
<<<<<<< HEAD
          <p>Buy Page!</p>
=======
          <Buy query={search}/>
>>>>>>> 1d20c17f5b238192ae9b583606354fee65d61b4a
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