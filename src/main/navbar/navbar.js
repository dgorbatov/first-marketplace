import "./navbar.css";
import { Link, Route } from "react-router-dom";
import search from "../../assets/search.svg";

function Navbar() {
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
          <Link className={"link-nav-main"} to="/ms/sell">Sell</Link>
          <Route path="/ms/sell" exact>
            <hr></hr>
          </Route>
        </article>
        <article>
          <Link className={"link-nav-main"} to="/ms/account">Account</Link>
          <Route path="/ms/account" exact>
            <hr></hr>
          </Route>
        </article>
      </section>

      <section className="search">
        <input type="text" placeholder="Search....."></input>
        <img src={search} alt="search icon"/>
      </section>
    </div>
  );
}

export default Navbar;