import "./ls.css";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";

function LS() {
  const [ emailLog, setEmailLog ] = useState(false);
  firebase.app();

  function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
      .signInWithPopup(provider)
       .then((result) => { console.log(result.user); })
      .catch((error) => { });
  }

  return (
    <div className="ls">
      <Router>
        <article>
          { !emailLog && <div>
            <section>
              <Switch>
                <Route path="/ss/ls/login" exact>
                  <h1>Login</h1>
                </Route>
                <Route path="/ss/ls/signup" exact>
                  <h1>Sign Up</h1>
                </Route>
                <Route path="*">
                  <Redirect to="/error/404" />
                </Route>
              </Switch>
            </section>

            <section>
              <section onClick={() => { signInWithGoogle(); }}>
                <p>Google</p>
              </section>

              <section>
                <p>Facebook</p>
              </section>

              <section>
                <p>Github</p>
              </section>

              <section onClick={() => { setEmailLog(true); }}>
                <p>Email</p>
              </section>
            </section>

            <section>
              <Switch>
                <Route path="/ss/ls/login" exact>
                  <Link className="login-link" to="/ss/ls/signup">Create an Account</Link>
                </Route>
                <Route path="/ss/ls/signup" exact>
                  <Link className="login-link" to="/ss/ls/login">Already A Member? Login</Link>
                </Route>
              </Switch>
            </section>
          </div>}

          { emailLog && <div>
            <Switch>
              <Route path="/ss/ls/login" exact>
                <h1>Login Into Account</h1>
              </Route>
              <Route path="/ss/ls/signup" exact>
                <h1>Create an Account</h1>
              </Route>
            </Switch>

            <section>
              <input type="text" id="fname" name="fname" autocomplete="off" value="" aria-labelledby="placeholder-fname" />
              <label className="placeholder-text" for="fname" id="placeholder-fname">
                <div className="text">First Name</div>
              </label>
            </section>
          </div>}
        </article>
      </Router>
    </div>
  );
}

export default LS;