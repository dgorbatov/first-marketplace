import "./ls.css";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import firebase from "firebase/app";
import "firebase/auth";
import { useState } from "react";
import { useHistory } from "react-router-dom";

function LS() {
  let history = useHistory();
  const [emailLog, setEmailLog ] = useState(false);
  const [incorrectPassword, setIncorrectPassword ] = useState(false);
  const [formValue, setFormValue] = useState({email: "", password: ""});
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDHRkVZq1gWEQ4kWLsV--PjSdc2udL1kX4",
    authDomain: "firstmarketplace-d3d3b.firebaseapp.com",
    databaseURL: "https://firstmarketplace-d3d3b-default-rtdb.firebaseio.com",
    projectId: "firstmarketplace-d3d3b",
    storageBucket: "firstmarketplace-d3d3b.appspot.com",
    messagingSenderId: "506337230664",
    appId: "1:506337230664:web:7355588d6370176d6a3d7d",
    measurementId: "G-R8M8TSPN42"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
      .signInWithPopup(provider)
       .then((result) => { history.push("/ss/info"); })
      .catch((error) => { history.push("/error" + error.code); });
  }

  function signInWithGithub() {
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth()
      .signInWithPopup(provider)
       .then((result) => { history.push("/ss/info"); })
      .catch((error) => { history.push("/error" + error.code); });
  }

  function logInWithEmail() {
    firebase.auth().signInWithEmailAndPassword(formValue.email, formValue.password)
    .then((userCredential) => {
      history.push("/ss/info");
    })
    .catch((error) => {
      console.error(error.code);
      if (error.code === "auth/wrong-password") {
        setIncorrectPassword(true);
        setTimeout(() => {
          setIncorrectPassword(false);
        }, 3000);
      } else {
        history.push("/error" + error.code);
      }
    });
  }

  function signInWithEmail(form) {
    form.preventDefault();
    if (window.location.href === "/ss/ls/login") {
      logInWithEmail();
    } else {
      firebase.auth().createUserWithEmailAndPassword(formValue.email, formValue.password)
      .then((userCredential) => {
        history.push("/ss/info");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          logInWithEmail();
        } else {
          history.push("/error" + error.code);
        }
      });

    }
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
                <p>Twitter</p>
              </section>

              <section onClick={() => { signInWithGithub(); }}>
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

            <section className="emailForm">
              <form onSubmit={signInWithEmail}>
                <input type="email" required value={formValue.email} placeholder="Email"
                        onChange={(value) => setFormValue({email: value.target.value,
                          password: formValue.password})}/>
                <input type="password" required value={formValue.password}
                       placeholder="Password" minLength="7"
                        onChange={(value) => setFormValue({email: formValue.email,
                          password: value.target.value})}/>

                {incorrectPassword && <p>Invalid Password</p>}

                <article className="ls-button-section">
                  <button onClick={() => {setEmailLog(false);}}>Back</button>
                  <button>Next</button>
                </article>

              </form>
            </section>
          </div>}
        </article>
      </Router>
    </div>
  );
}

export default LS;