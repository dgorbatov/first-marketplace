import "./menu.css";
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';
import { initializeApp } from "firebase/app";
import { useCallback, useEffect, useState } from "react";
import { getDoc, getFirestore, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import "../../../extra/emulators";
import config from "../../../extra/config";

initializeApp(config);
const db = getFirestore();
const storage = getStorage();

function Main(props) {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateListings = useCallback(async () => {
    if (props.uid === undefined)
      return;

    setLoading(true);

    let listings_new = [];

    for (let id of props.listings) {
      const listingSnap = await getDoc(doc(db, "listings", id));
      listings_new.push([listingSnap.id, listingSnap.data()]);
    }
    setLoading(false);

    setListings(listings_new);

    if (listings_new.length > 9) {
      setError("Max 10 listings, to add please remove a listing or set it to sold")
    } else {
      setError("");
    }
  }, [props.uid, props.listings]);

  useEffect(() => {
    updateListings();
  }, [updateListings]);

  function getDate(time) {
    time = time.toISOString().slice(0,10).replace(/-/g,"");
    let day = time.slice(6)
    let month = time.slice(4,6)
    let year = time.slice(2,4)
    return month + "/" + day + "/" + year;
  }

  async function updateListing(key, new_val) {
    setLoading(true);
    const docSnap = await getDoc(doc(db, "listings", key));

    for (let i of docSnap.data().pictures) {
      await deleteObject(ref(storage, i));
    }

    updateDoc(doc(db, "listings", key), {
      status : new_val
    })

    updateDoc(doc(db, "user-info", props.uid), {
      listings: arrayRemove(key),
      removed: arrayUnion(key)
    })

    updateListings();
    setLoading(false);
  }

  return (
    <div className="menu">
      {loading ? <Icon icon="eos-icons:bubble-loading" height="30vh" width="30vw" className="loading"/>
      :
      <div className={props.mode === "l" ? "menu light-menu" : "menu dark-menu"}>
        <p>Current Listings</p>
        <p className="sell-menu-err">{error}</p>
        {
          listings.map((listing, index) => (
            <section className="listing-sell" key={listing[0]}>
              <p>{listing[1].basicinfo.name} - {getDate(listing[1]["create-time"].toDate())}</p>
              <article>
                <Link to={"/ms/item/" + listing[0]} className="link-listing-sell">View</Link>
                <Link to={"/ms/sell/sell-item/" + listing[0]} className="link-listing-sell">Edit</Link>
                <p className="link-listing-sell" onClick={() => {updateListing(listing[0], "r")}}>Remove</p>
                <p className="link-listing-sell"onClick={() => {updateListing(listing[0], "s")}}>Sold</p>
              </article>
            </section>
          ))
        }

        <Link to={error === "" && "/ms/sell/sell-item/new"} className="sell-add-button" ><Icon height="9vh" icon="carbon:add-alt"/></Link>
    </div> }
    </div>
  );
}

export default Main;