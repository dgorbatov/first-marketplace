import './App.css';
import Logdout from "./logedout/logedout";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Error from "./error/error";

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
}else {
  firebase.app()
}

const auth = firebase.auth();

function App() {
  const [ user ] = useAuthState(auth);

  return (

    <div className="App">
      <Router>
        <Switch>
          <Route path="/error/:type" exact>
             <Error />
          </Route>

          <Route path="/ss/:page" exact>
            <Logdout />
          </Route>

          <Route path="/" exact>
            { !user && <Redirect to={"/ss/welcome"} />}
            { user && <p>Welcome to the Home Page</p>}
          </Route>

          <Route path="*">
             <Redirect to={"/error/404"} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;