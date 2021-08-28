import "./navbar.css";
import { Link, Route } from "react-router-dom";
import search from "../../assets/search.svg";
import { useState } from "react";

function Navbar(props) {
  const [query, setQuery] = useState("");

  return (
    <div className={props.mode === "l" ? "navbar-main light-navbar-main" : "navbar-main dark-navbar-main"}>
      <Link className={"link-main"} to="/ss/welcome">FIRST Marketplace {props.country !== "" && props.country}</Link>

      <section className="links-main">
        <article>
          <Link className={"link-nav-main"} to="/ms/buy">Buy</Link>
          <Route path="/ms/buy" exact>
            <hr></hr>
          </Route>
        </article>
        <article>
          <Link className={"link-nav-main"} to="/ms/sell/menu" onClick={() => setQuery("") }>Sell</Link>
          <Route path="/ms/sell">
            <hr></hr>
          </Route>
        </article>
        <article>
          { props.authState ? <Link className={"link-nav-main"} to="/ms/account" onClick={() => setQuery("") }>Account</Link>
           : <Link className={"link-nav-main"} to="/ss/ls/login">Log In</Link>}
          <Route path="/ms/account" exact>
            <hr></hr>
          </Route>
        </article>
      </section>

      <section className="search">
        <form onSubmit={form => {
          form.preventDefault();
          props.searchCallback(query)}
         }
              disabled={!(window.location.pathname === "/ms/buy")}>
          <input type="text" placeholder="Search....."
               value={window.location.pathname === "/ms/buy" ? query : ""}
               onChange={change => { setQuery(change.target.value); }} />
          <button><img src={search} alt="search icon"/></button>
        </form>
      </section>
    </div>
  );
}

export default Navbar;