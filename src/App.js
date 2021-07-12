import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Welcome from "./welcome/welcome"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/welcome" exact>
            <Welcome />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;