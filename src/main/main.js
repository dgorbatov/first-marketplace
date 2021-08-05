import "./main.css";
import { Link } from "react-router-dom"
import Navbar from "../main/navbar/navbar";

function Main() {

  return (
    <div className="main">
      <Navbar />
      <p>Hello World!</p>
      <Link to="/ss/welcome"><p>To Welcome Page</p></Link>
    </div>
  );
}

export default Main;