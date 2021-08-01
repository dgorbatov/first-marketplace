import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Welcome from "./welcome/welcome";
import LS from "./ls/ls";
import Contact from "./contact/contact";

function Logedout() {
  return (
    <div className="Logedout">
      <Router>
        <Switch>
          <Route path="/ss/welcome" exact>
            <Welcome />
          </Route>
          <Route path="/ss/ls/:type">
            <LS />
          </Route>

          <Route path="/ss/contact">
            <Contact />
          </Route>

          <Route path="*">
            <Redirect to={"/error/404"} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default Logedout;