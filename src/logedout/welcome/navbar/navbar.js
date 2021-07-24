import "./navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="welcome-navbar">
      <Link to="/ss/ls/login">Log In</Link>
      <Link to="/ss/ls/signup">Sign Up</Link>
    </div>
  );
}

export default Navbar;