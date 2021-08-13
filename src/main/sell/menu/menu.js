import "./menu.css";
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';

function Main() {
  return (
    <div className="menu">
      <p>Current Listings</p>

      <section className="listing-sell">
        <p>Flywheel - 9/16/20</p>
        <article key={5}>
          <Link to="" className="link-listing-sell">View</Link>
          <Link to={"/ms/sell/sell-item/bob"} className="link-listing-sell">Edit</Link>
          <p>Remove</p>
        </article>
      </section>

      <Link to="/ms/sell/sell-item/new" className="sell-add-button"><Icon height="9vh" icon="carbon:add-alt"/></Link>
    </div>
  );
}

export default Main;