import "./beach.css";
import beach from "../../../assets/robot-beach.png";
import { Link } from "react-router-dom";

function Lake() {
  return (
    <div className="beach">
      <img src={beach} alt="robot parts on stump"></img>

      <section className="stats">
        <h2>Over 100 active teams</h2>
        <h2>Over 200 listings</h2>
        <h2>Over 100 parts donated</h2>
        <h2>Over 30 items sold</h2>
      </section>

      <article>
        <section>
          <Link>Donate</Link>
        </section>

        <section>
          <Link to="/ss/ls/login">Login</Link>
        </section>

        <section>
          <Link to="/ss/ls/signup">Signup</Link>
        </section>
      </article>
    </div>
  );
}

export default Lake;