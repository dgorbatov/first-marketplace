import './App.css';
import Logdout from "./logedout/logedout";
import Main from "./main/main";
import Extra from "./extra/extra";
import { initializeApp } from "firebase/app";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Error from "./error/error";
import connectAll from "./extra/emulators";
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';

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
initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
connectAll(auth, db, storage);

function App() {
  return (

    <div className="App">
      <Router>
        <Switch>
          <Route path="/error/:type" exact>
             <Error />
          </Route>

          <Route path="/ss">
            <Logdout />
          </Route>

          <Route path="/ms">
            <Main />
          </Route>

          <Route path="/e">
            <Extra />
          </Route>

          <Route path="/" exact>
            <Redirect to="/ms/buy" />
          </Route>

          <Route path="/main-sight-a" exact component={() => {
            window.location.href = "https://www.youtube.com/watch?v=iik25wqIuFo";
            return null;
          }} />

          <Route path="*">
             <Redirect to={"/error/404"} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;