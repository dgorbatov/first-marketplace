import "./error.css";
import { Route, Switch, Link } from 'react-router-dom';

function Error() {
  return (
    <div className="err">
      <p>Uh Oh!!!!</p>
      <Switch>
        <Route path="/error/404" exact>
          <p>404 Error :( </p>
        </Route>
        <Route path="/error/">
          <p>Looks Like Their Was A Problem With The Sight :(</p>
        </Route>
      </Switch>
      <Link to="/main-sight-a" className="error-link">Go Back To Main Page</Link>
    </div>
  );
}

export default Error;