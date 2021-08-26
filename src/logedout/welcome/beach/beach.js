import "./beach.css";
import beach from "../../../assets/robot-beach.png";
import { Link } from "react-router-dom";

function Lake() {
  return (
    <div className="beach">
      <img src={beach} alt="robot parts on stump"></img>

      <section className="stats">
        <h2>Excellent idea - Aakarsh (18737)</h2>
        <h2>Seems Neat - Abhii (FRC Sushi squad)</h2>
        <h2>Love the idea - Nate (18657)</h2>
        <h2>Looks Great! - Hanoop</h2>
      </section>

      <article>
        <section>
          <Link to="/donate">Donate</Link>
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