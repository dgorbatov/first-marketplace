import "./navbar.css";
import { Link, Route } from "react-router-dom";
import search from "../../assets/search.svg";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
const auth = getAuth();

function Navbar(props) {
  const [query, setQuery] = useState("");
  const [authState, setAuthState] = useState(false);

  onAuthStateChanged(auth, user => {
    if (user)
      setAuthState(true);
    else
      setAuthState(false);
  });

  return (
    <div className="navbar-main">
      <Link className={"link-main"} to="/ss/welcome">FIRST Marketplace</Link>

      <section className="links-main">
        <article>
          <Link className={"link-nav-main"} to="/ms/buy">Buy</Link>
          <Route path="/ms/buy" exact>
            <hr></hr>
          </Route>
        </article>
        <article>
          <Link className={"link-nav-main"} to="/ms/sell/menu">Sell</Link>
          <Route path="/ms/sell">
            <hr></hr>
          </Route>
        </article>
        <article>
          { authState && <Link className={"link-nav-main"} to="/ms/account">Account</Link>}
          { !authState && <Link className={"link-nav-main"} to="/ss/ls/login">Log In</Link>}
          <Route path="/ms/account" exact>
            <hr></hr>
          </Route>
        </article>
      </section>

      <section className="search">
        <input type="text" placeholder="Search....."
               value={window.location.pathname === "/ms/buy" ? query : ""}
               onChange={change => { setQuery(change.target.value); } } />
        <button onClick={() => props.searchCallback(query) } disabled={!(window.location.pathname === "/ms/buy")}><img src={search} alt="search icon"/></button>
      </section>
    </div>
  );
}

export default Navbar;