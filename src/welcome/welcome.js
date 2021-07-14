import "./welcome.css";
import Footer from "./footer/footer"
import Lake from "./lake/lake"
import Yard from "./yard/yard"
import Beach from "./beach/beach"

function Welcome() {
  return (
    <div className="Welcome">
      <Lake />
      <Yard />
      <Beach />
      <Footer />
    </div>
  );
}

export default Welcome;