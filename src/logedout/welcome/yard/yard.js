import "./yard.css";
import yard from "../../../assets/robot-yard.png";

function Lake() {
  return (
    <div className="yard">
      <img src={yard} alt="robot parts on stump"></img>
      <h1>About Us:</h1>
      <h2>
          FIRST Marketplace is a way for teams to sell, buy
          and donate parts to other teams. It serves FLL, FTC
          and FRC parts.
      </h2>
    </div>
  );
}

export default Lake;