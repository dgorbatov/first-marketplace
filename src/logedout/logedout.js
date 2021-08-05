import { Route } from 'react-router-dom';
import Welcome from "./welcome/welcome";
import LS from "./ls/ls";
import Contact from "./contact/contact";
import Info from "./info/info";

function Logedout() {
  return (
    <div className="Logedout">
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
    </div>
  );
}

export default Logedout;