import "./menu.css";
import { Link, useHistory } from "react-router-dom";
import { Icon } from '@iconify/react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useState } from "react";
import { getDoc, getFirestore, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

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
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

function Main() {
  const history = useHistory();
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [uid, setUid] = useState(undefined);
  const [loading, setLoading] = useState(false);

  onAuthStateChanged(auth, async user => {
    if (!user) {
      history.push("/ss/ls/login");
    } else if (listings.length === 0) {
      setUid(user.uid);
      updateListings();
    } else {
      setUid(user.uid);
    }
  });

  async function updateListings() {
    setLoading(true);
    if (uid === undefined)
      return;

    const docSnap = await getDoc(doc(db, "user-info", uid));

    if (!docSnap.exists())
      history.push("/ss/info");

    let listings_new = [];

    for (let id of docSnap.data().listings) {
      const listingSnap = await getDoc(doc(db, "listings", id));
      listings_new.push([listingSnap.id, listingSnap.data()]);
    }

    setListings(listings_new);

    if (listings_new.length > 4) {
      setError("Max 5 listings, to add please remove a listing or set it to sold")
    } else {
      setError("");
    }
    setLoading(false);
  }

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

    updateDoc(doc(db, "user-info", uid), {
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
      <div className="menu">
        <p>Current Listings</p>
        <p className="sell-menu-err">{error}</p>
        {
          listings.map((listing) => (
            <section className="listing-sell" key={listing[0]}>
              <p>{listing[1].basicinfo.name} - {getDate(listing[1]["create-time"].toDate())}</p>
              <article>
                <Link to={"/ms/item/" + listing[0]} className="link-listing-sell">View</Link>
                {/* <Link to={"/ms/sell/sell-item/bob"} className="link-listing-sell">Edit</Link> */}
                <p onClick={() => {updateListing(listing[0], "r")}}>Remove</p>
                <p onClick={() => {updateListing(listing[0], "s")}}>Sold</p>
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