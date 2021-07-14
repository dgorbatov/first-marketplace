import "./beach.css";
import beach from "../../assets/robot-beach.png";

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
          <h2>Donate</h2>
        </section>

        <section>
          <h2>Login</h2>
        </section>

        <section>
          <h2>Signup</h2>
        </section>
      </article>
    </div>
  );
}

export default Lake;