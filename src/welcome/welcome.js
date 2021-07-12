import "./welcome.css";
import Footer from "./footer/footer"
import Lake from "./lake/lake"

function Welcome() {
  return (
    <div className="Welcome">
      <Lake />
      <Footer />
    </div>
  );
}

export default Welcome;