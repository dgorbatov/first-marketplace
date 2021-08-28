import "./ls.css";
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';
import { signInWithPopup, getAuth, GoogleAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { initializeApp } from "firebase/app";
import config from "../../extra/config";

initializeApp(config);
const auth = getAuth();

function LS() {
  let history = useHistory();
  const [emailLog, setEmailLog ] = useState(false);
  const [incorrectPassword, setIncorrectPassword ] = useState(false);
  const [formValue, setFormValue] = useState({email: "", password: ""});

  function signInWithGoogle() {
    signInWithPopup(auth, new GoogleAuthProvider())
     .then(() => { history.push("/ss/info"); })
     .catch((error) => {
        if (error.code !== "auth/popup-closed-by-user")
          history.push("/error" + error.code);
      });
  }

  function signInWithGithub() {
    signInWithPopup(auth, new GithubAuthProvider())
     .then((result) => { history.push("/ss/info"); })
     .catch((error) => {
        if (error.code !== "auth/popup-closed-by-user")
          history.push("/error" + error.code);
      });
  }

  function logInWithEmail() {
    signInWithEmailAndPassword(auth, formValue.email, formValue.password)
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
      createUserWithEmailAndPassword(auth, formValue.email, formValue.password)
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