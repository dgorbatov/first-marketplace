import "./navbar.css";
import { Link, Route } from "react-router-dom";
import search from "../../assets/search.svg";
import { useState } from "react";
import { Icon } from '@iconify/react';

function Navbar(props) {
  const [query, setQuery] = useState("");
  const styles = { "display": "none" }
  const [searchState, setSearchState] = useState(false);
  const [menu, setMenu] = useState(false);


  function mobileSearch() {
    if (!searchState) {
      setSearchState(true);
    }
  }

  return (
    <div className={props.mode === "l" ? "navbar-main light-navbar-main" : "navbar-main dark-navbar-main"}>
      <Link className={"link-main search-mobile"} to="/"
          style={!searchState ? {} : styles}>First Marketplace {props.country !== "" && props.country}</Link>

      <Link className={"link-main search-desktop"} to="/">First Marketplace {props.country !== "" && props.country}</Link>

      <section className="links-main">
        <article>
          <Link className={"link-nav-main"} to="/ms/buy">Buy</Link>
          <Route path="/ms/buy" exact>
            <hr></hr>
          </Route>
        </article>
        <article>
          { props.authState ? <Link className={"link-nav-main"} to="/ms/sell/menu" onClick={() => setQuery("") }>Sell</Link>
           : <Link className={"link-nav-main"} to="/ss/ls/login">Sell</Link>}
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
          <input type="text" placeholder="Search....." className="search-mobile"
               value={window.location.pathname === "/ms/buy" ? query : ""}
               onChange={change => { setQuery(change.target.value); }}
               style={searchState ? {} : styles} />

          <input type="text" placeholder="Search....." className="search-desktop"
               value={window.location.pathname === "/ms/buy" ? query : ""}
               onChange={change => { setQuery(change.target.value); }}/>

          <button className="search-mobile" onClick={mobileSearch}><img src={search} alt="search icon"/></button>
          <button className="search-desktop"><img src={search} alt="search icon"/></button>
          <Icon icon="ant-design:menu-outlined" className="menu-nav" height="3vh" style={!searchState ? {} : styles}
                onClick={() => setMenu(!menu)}/>
          <Icon icon="bi:x-lg" onClick={() => {props.searchCallback(""); setQuery(""); setSearchState(false); } }
                className="menu-nav exit" height="3vh" style={searchState ? {} : styles}/>
        </form>
      </section>

      {menu && <article className="nav-menu">
        <Link className={"link-nav-main"} to="/ms/buy" onClick={() => setMenu(false)}>Buy</Link>
        { props.authState ? <Link className={"link-nav-main"} to="/ms/sell/menu" onClick={() => {setQuery(""); setMenu(false);} }>Sell</Link>
           : <Link className={"link-nav-main"} to="/ss/ls/login">Sell</Link>}
        { props.authState ? <Link className={"link-nav-main"} to="/ms/account" onClick={() => {setQuery(""); setMenu(false);} }>Account</Link>
           : <Link className={"link-nav-main"} to="/ss/ls/login">Account</Link>}
        <Link className={"link-nav-main"} to="/ss/welcome">About Us</Link>
        <Link className={"link-nav-main"} to="/ss/ls/login">Log In</Link>
        <Link className={"link-nav-main"} to="/ss/ls/signup">Sign In</Link>
      </article>}
    </div>
  );
}

export default Navbar;