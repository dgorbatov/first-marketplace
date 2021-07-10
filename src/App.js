// import logo from './logo.svg';
import './App.css';
import logo from "./FTC_for_Dummies_Logo_good__1_-removebg-preview.png";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from "./navbar/navbar"

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
      </Router>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="The Hexademicals" />
        <p>
          404. You typed in the wrong URL, learn how to spell.
        </p>
      </header> */}
    </div>
  );
}

export default App;