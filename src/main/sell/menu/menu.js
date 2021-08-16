import "./menu.css";
import { Link, useHistory } from "react-router-dom";
import { Icon } from '@iconify/react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useState } from "react";
import { getDoc, getFirestore, doc, updateDoc } from "firebase/firestore";
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
  let uid;

  onAuthStateChanged(auth, async user => {
    if (!user) {
      history.push("/ss/ls/login");
    } else if (listings.length === 0) {
      uid = user.uid;
      updateListings();
    } else {
      uid = user.uid;
    }
  });

  async function updateListings() {
    const docSnap = await getDoc(doc(db, "listings", uid));
    let listings_new = [];

    for (let i of Object.entries(docSnap.data())) {
      if (typeof i[1] !== "string")
        listings_new.push(i);
    }
    setListings(listings_new);

    if (listings_new.length > 2) {
      setError("Max 5 listings, to add please remove a listing or set it to sold")
    } else {
      setError("");
    }
  }

  function getDate(time) {
    time = time.toISOString().slice(0,10).replace(/-/g,"");
    let day = time.slice(6)
    let month = time.slice(4,6)
    let year = time.slice(2,4)
    return month + "/" + day + "/" + year;
  }

  async function updateListing(key, new_val) {
    const docSnap = await getDoc(doc(db, "listings", uid));

    for (let i of Object.values(docSnap.data()[key].pictures)) {
      await deleteObject(ref(storage, i));
    }

    updateDoc(doc(db, "listings", uid), {
      [key] : new_val
    })

    updateListings();
  }

  return (
    <div className="menu">
      <p>Current Listings</p>
      <p className="sell-menu-err">{error}</p>
      {
        listings.map((listing) => (
          <section className="listing-sell" key={listing[0]}>
            <p>{listing[1].basicinfo.name} - {getDate(listing[1].time.toDate())}</p>
            <article>
              <Link to="" className="link-listing-sell">View</Link>
              {/* <Link to={"/ms/sell/sell-item/bob"} className="link-listing-sell">Edit</Link> */}
              <p onClick={() => {updateListing(listing[0], "r")}}>Remove</p>
              <p onClick={() => {updateListing(listing[0], "s")}}>Sold</p>
            </article>
          </section>
        ))
      }

      <Link to={error === "" && "/ms/sell/sell-item/new"} className="sell-add-button" ><Icon height="9vh" icon="carbon:add-alt"/></Link>
    </div>
  );
}

export default Main;