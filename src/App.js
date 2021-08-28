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
import { getAnalytics, logEvent  } from "firebase/analytics";
import { useEffect } from 'react';
import config from "./extra/config";

initializeApp(config);

const analytics = getAnalytics();
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
connectAll(auth, db, storage);

function App() {
  useEffect(() => {
    logEvent(analytics, "webpage-viewed");
  }, []);

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