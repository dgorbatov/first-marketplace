import "./sell.css";
import Menu from "./menu/menu";
import Add from "./add/add";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

function Sell(props) {
  const history = useHistory();

  if (!props.authState || !props.user) {
    history.push("/ss/ls/login");
  }

  return (
    <div className="sell">
      {props.user &&
      <Switch>
        <Route path="/ms/sell/menu" exact>
          <Menu uid={props.user.uid} listings={props.data.listings}/>
        </Route>

        <Route path="/ms/sell/sell-item/:id" exact>
          <Add uid={props.user.uid} />
        </Route>

        <Route path="*" exact>
          <Redirect to="/error/404" />
        </Route>
      </Switch>}
    </div>
  );
}

export default Sell;