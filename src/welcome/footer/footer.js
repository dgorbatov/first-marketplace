import './footer.css';
import logo from "../../assets/logo.png"
import mail from "../../assets/gmail.svg"
import youtube from "../../assets/youtube.svg"

function Footer() {
  return (
    <div className="footer">
      <section className="links">
        <p>Back to Top</p>
        <p>Contact Us</p>
      </section>

      <section>
        <img src={logo} alt="Our logo"></img>
      </section>

      <section className="icons">
        <img src={mail} alt="Mail"></img>
        <img src={youtube} alt="Youtube"></img>
      </section>
    </div>
  );
}

export default Footer;