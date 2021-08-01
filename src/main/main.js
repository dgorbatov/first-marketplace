import "./main.css";
import { Link } from "react-router-dom"

function Main() {

  return (
    <div className="main">
      <p>Hello World!</p>
      <Link to="/ss/welcome"><p>To Welcome Page</p></Link>
    </div>
  );
}

export default Main;