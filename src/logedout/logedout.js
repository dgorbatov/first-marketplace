import { Route, Switch, Redirect } from 'react-router-dom';
import Welcome from "./welcome/welcome";
import LS from "./ls/ls";
import Contact from "./contact/contact";
import Info from "./info/info";

function Logedout() {
  return (
    <div className="Logedout">
      <Switch>
        <Route path="/ss/welcome" exact>
          <Welcome />
        </Route>
        <Route path="/ss/ls/:type">
          <LS />
        </Route>

        <Route path="/ss/contact" exact>
          <Contact />
        </Route>

        <Route path="/ss/info" exact>
          <Info />
        </Route>

        <Route path="/ss/privacypolicy" exact>
          <p>Hello My Name is Jeff</p>
        </Route>

        {window.location.href.includes("ss") && <Route path="*" exact>
          <Redirect to="/error/404" />
        </Route>}
      </Switch>
    </div>
  );
}

export default Logedout;