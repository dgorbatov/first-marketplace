import "./item.css"
import config from "../../extra/config";
import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { Icon } from '@iconify/react';
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { list } from "@firebase/storage";

initializeApp(config);
const db = getFirestore();
const auth = getAuth();
const style1 = {    "padding-bottom" : "8vh"};
function Item(props) {
  const history = useHistory();
  const { id } = useParams();
  const [gotListing, setGotListing] = useState(0);
  const [pictureUrl, setPictureUrl] = useState("");
  const [idx, setIdx] = useState(0);
  const [contText, setContText] = useState("Contact Owner");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [team, setTeam] = useState(null);
  const [uid, setUid] = useState("no-team");

  useEffect(() => {

    async function fetchData() {
      setLoading(true);
      const docSnap = await getDoc(doc(db, "listings", id));
      if (!(docSnap.exists()))
        history.push("/error/404");
      else {
        if (docSnap.data().status !== "a") {
          if (docSnap.data().status === "r")
            setError("This Listing Was Removed");
          else
            setError("This Listing Was Sold");
        } else {
          const docSnap2 = await getDoc(doc(db, "user-info/" + docSnap.data().uid + "/profile/info"));

          if (docSnap2.exists()) {
            setTeam(docSnap2.data());
            setUid(docSnap.data().uid);
          }

          let url = null;
          if (docSnap.data()["picture_urls"][0] !== undefined)
            url = docSnap.data()["picture_urls"][0];

          setPictureUrl(url)
          setGotListing(docSnap.data());
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [history, id]);

  async function goForward() {
    if (pictureUrl === null)
      return;
    let new_idx = idx + 1;

    if (new_idx >= gotListing.pictures.length)
      new_idx = 0;

    setIdx(new_idx);
    setPictureUrl(gotListing["picture_urls"][new_idx])
  }

  async function goBack() {
    if (pictureUrl === null)
      return;
    let new_idx = idx - 1;

    if (new_idx < 0)
      new_idx = gotListing.pictures.length - 1;

    setIdx(new_idx);
    setPictureUrl(gotListing["picture_urls"][new_idx])
  }

  function contact() {
    const user = auth.currentUser;

    if (contText === "Please Sign In") {
      window.location.href = "/ss/ls/login";
    }

    setContText("Contact Owner");

    if (!user) {
      setContText("Please Sign In");
    } else {
      window.location.href = "mailto:" + gotListing.basicinfo.email;
    }
  }

  return (
    <div className={props.mode === "l" ? "outer-item light-item" : "outer-item dark-item"}>
      {loading ? <Icon icon="eos-icons:bubble-loading" height="30vh" width="30vw" className="loading"/>
      :
      <div className="item"
        style={team === null ? style1 : {}}>
        { gotListing.status === "a" &&
          <section>
            <h1 className="item-wrap" >{gotListing.basicinfo.name}</h1>
            {gotListing.req && <p><strong>Request</strong></p> }
            <p className="item-wrap" ><strong>Location:</strong> {gotListing.basicinfo.city + (gotListing.basicinfo.country !== undefined && ( " - " + gotListing.basicinfo.country))}</p>
            <p>
                <strong>Price:</strong> {gotListing.basicinfo.currency + gotListing.basicinfo.price}
                {gotListing.shipping.shippingCost !== "" &&
                ("+ " + gotListing.basicinfo.currency + gotListing.shipping.shippingCost + " shipping")}
            </p>
            <p className="item-wrap" ><strong>Condition: </strong>{gotListing.tags.condition}</p>
            <p className="item-wrap" ><strong>Competition: </strong>{gotListing.tags.comp}</p>
            {gotListing.tags.brand !== "Other" && <p className="item-wrap" ><strong>Vendor: </strong>{gotListing.tags.brand}</p>}

            {gotListing.basicinfo.quantity !== undefined && <p><strong>Quantity:</strong> {gotListing.basicinfo.quantity}</p>}
            <p><strong>Shipping:</strong> {gotListing.shipping.delivery ?
              ("Available, Shipping Time: " + gotListing.shipping.shippingTime) :
              "Not Available"}</p>
            <p><strong>Local Pickup:</strong> {gotListing.shipping.pickup ? "Available" : "Not Available"}</p>
            {gotListing.url !== "" && <a href={gotListing.url} className="item-link"><strong>Original Product</strong></a>}
            <p className="item-wrap"><strong>Description:</strong> {gotListing.basicinfo.description}</p>
            {gotListing.basicinfo.spec !== "" && <p className="item-wrap" ><strong>Spec:</strong> {gotListing.basicinfo.spec}</p>}

            {team !== null && <Link to={"/ms/team/" + uid} className="item-link">
              <div className="team">
                <img src={team.pfp} alt="User PFP"/>
                <p>{team.name}</p>
              </div>
            </Link>
            }
          </section>
        }

        { gotListing.status === "a" &&
          <section className="item-right">
            <article>
              <button onClick={goBack}><Icon className="item-icon-l" icon="fluent:arrow-next-20-filled" rotate={2} height="7vh"/></button>
              {
                pictureUrl !== null ?
                <div>
                  <img src={pictureUrl} alt="upload by user" />
                </div> :
                <Icon icon="carbon:no-image" height="30vh" />
              }
              <button onClick={goForward}><Icon className="item-icon-r" icon="fluent:arrow-next-20-filled" height="7vh" /> </button>
            </article>
            <button className="item-contact" onClick={contact}><p>{contText}</p></button>
          </section>
        }

        {
          gotListing.status !== "a" && typeof gotListing.status === "string" &&
          <p className="item-error">{error}</p>
        }
      </div> }
    </div>
  )
}

export default Item;