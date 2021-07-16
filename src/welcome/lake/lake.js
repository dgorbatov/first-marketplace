import "./lake.css";
import lake from "../../assets/robot-lake.png";
import logo from "../../assets/logo-light.png";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

function Lake() {

  useEffect(() => {
     AOS.init({
      duration: 400
     });
  }, []);

  return (
    <div className="lake">
      <img src={lake} alt="robot next to lake" className="lake-photo"></img>
      <img src={logo} alt="Our logo" className="lake-logo"></img>
      <h1>FIRST MARKETPLACE</h1>
      <h2>The only FIRST marketplace</h2>
    </div>
  );
}

export default Lake;