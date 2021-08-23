import "./item.css"
import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Icon } from '@iconify/react';
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHRkVZq1gWEQ4kWLsV--PjSdc2udL1kX4",
  authDomain: "firstmarketplace-d3d3b.firebaseapp.com",
  databaseURL: "https://firstmarketplace-d3d3b-default-rtdb.firebaseio.com",
  projectId: "firstmarketplace-d3d3b",
  storageBucket: "firstmarketplace-d3d3b.appspot.com",
  messagingSenderId: "506337230664",
  appId: "1:506337230664:web:7355588d6370176d6a3d7d",
  measurementId: "G-R8M8TSPN42"
};
initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

function Item() {
  const history = useHistory();
  const { id } = useParams();
  const [gotListing, setGotListing] = useState(0);
  const [pictureUrl, setPictureUrl] = useState("");
  const [idx, setIdx] = useState(0);
  const [contText, setContText] = useState("Contact Owner");

  useEffect(() => {

    async function fetchData() {
      const docSnap = await getDoc(doc(db, "listings", id));
      console.log(docSnap.data());
      if (!(docSnap.exists()))
        history.push("/error/404");

      else {
        if (docSnap.data().status !== "a") {
          if (docSnap.data().status === "r")
            setGotListing("This Listing Was Removed");
          else
            setGotListing("This Listing Was Sold");
        }

        let url = null;
        if (docSnap.data().pictures[0] !== undefined)
          url = await getDownloadURL(ref(storage, docSnap.data().pictures[0]));

        setPictureUrl(url)
        setGotListing(docSnap.data());
      }
    }
    fetchData();
  }, [history, id]);

  async function goForward() {
    if (pictureUrl === null)
      return;
    let new_idx = idx + 1;

    if (new_idx >= gotListing.pictures.length)
      new_idx = 0;
    const url = await getDownloadURL(ref(storage, gotListing.pictures[new_idx]));

    setIdx(new_idx);
    setPictureUrl(url)
  }

  async function goBack() {
    if (pictureUrl === null)
      return;
    let new_idx = idx - 1;

    if (new_idx < 0)
      new_idx = gotListing.pictures.length - 1;
    const url = await getDownloadURL(ref(storage, gotListing.pictures[new_idx]));

    setIdx(new_idx);
    setPictureUrl(url)
  }

  function contact() {
    const user = auth.currentUser;
    setContText("Contact Owner");

    if (!user) {
      setContText("Please Sign In");
    } else {
      window.location.href = "mailto:" + gotListing.basicinfo.email;
    }
  }

  return (
    <div className="outer-item">
      <div className="item">
        { gotListing.status === "a" &&
          <section>
            <h1 className="item-wrap" >{gotListing.basicinfo.name}</h1>
            <p className="item-wrap" ><strong>Location:</strong> {gotListing.basicinfo.city}</p>
            <p>
                <strong>Price:</strong> ${gotListing.basicinfo.price}
                {gotListing.shipping.shippingCost !== "" &&
                ("+ $" + gotListing.shipping.shippingCost + " shipping")}
            </p>
            <p><strong>Shipping:</strong> {gotListing.shipping.delivery ?
              ("Available, Shipping Time: " + gotListing.shipping.shippingTime) :
              "Not Available"}</p>
            <p><strong>Local Pickup:</strong> {gotListing.shipping.pickup ? "Available" : "Not Available"}</p>
            {gotListing.url !== "" && <a href={gotListing.url} className="item-link"><strong>Original Product:</strong></a>}
            <p className="item-wrap"><strong>Description:</strong> {gotListing.basicinfo.description}</p>
            {gotListing.basicinfo.spec !== "" && <p className="item-wrap" ><strong>Spec:</strong> {gotListing.basicinfo.spec}</p>}
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
          <p className="item-error">{gotListing}</p>
        }
      </div>
    </div>
  )
}

export default Item;