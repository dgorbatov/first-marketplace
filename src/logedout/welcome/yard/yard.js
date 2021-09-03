import "./yard.css";
import yard from "../../../assets/robot-yard.png";

function Lake() {
  return (
    <div className="yard">
      <img src={yard} alt="robot parts on stump"></img>
      <h1>About Us:</h1>
      <h2>
          First Marketplace is a way for teams to sell, buy
          and donate parts to other teams. It serves FLL, FTC
          and FRC parts. We are in no way affiliated to FIRST.
      </h2>
    </div>
  );
}

export default Lake;