import "./welcome.css";
import Footer from "./footer/footer"
import Lake from "./lake/lake"
import Yard from "./yard/yard"
import Beach from "./beach/beach"
import Navbar from "./navbar/navbar";

function Welcome() {
  return (
    <div className="Welcome">
      <Navbar />
      <div className="overflow-hide">
        <Lake />
        <Yard />
        <Beach />
        <Footer />
      </div>
    </div>
  );
}

export default Welcome;