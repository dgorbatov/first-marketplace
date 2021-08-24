import { Switch, Route, Redirect } from "react-router-dom";
import Submitted from "./submitted/submitted";

function Extra() {
  return (
    <div className="extra">
      <Switch>
        <Route path="/e/submitted" exact>
          <Submitted />
        </Route>

        <Route path="*">
          <Redirect to="/error/404"/>
        </Route>
      </Switch>
    </div>
  )
}

export default Extra;