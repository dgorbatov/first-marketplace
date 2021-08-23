import "./buy.css"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Icon } from '@iconify/react';

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

function Buy(props) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, "listings"), getListings);

    async function getListings(docs)  {
      let new_listings = []

      docs.forEach(doc => {
        if (doc.data().status === "a")
          new_listings.push([doc.id, doc.data()]);
      });

      new_listings = await modifyListings(new_listings);

      setListings(new_listings);
    }
  }, []);

  async function modifyListings(listings_modify) {
    let res = []

    for (let list of listings_modify) {
      let url = null;

      if (list[1].pictures[0] !== undefined) {
        const pic_ref = ref(storage, list[1].pictures[0])
        url = await getDownloadURL(pic_ref)
      }

      let shipping = "";

      if (list[1].shipping.delivery)
        shipping += "Shipped"
      if (list[1].shipping.pickup) {
        if (shipping !== "")
          shipping += "/"
        shipping += "Local"
      }

      res.push({
        key: list[0],
        city: list[1].basicinfo.city,
        description: list[1].basicinfo.description,
        name: list[1].basicinfo.name,
        price: list[1].basicinfo.price,
        picture: url,
        ship: shipping,
        brand: list[1].tags.brand,
        condition: list[1].tags.condition,
        comp: list[1].tags.comp
      });
    }

    return res;
  }

  return (
    <div className="buy">
      <section>
        {
          listings.map(listing => (
            <Link className="buy-link" key={listing.key} to={"/ms/item/" + listing.key}>
              <article className="listing-buy">
                <article>
                  <section className="buy-top">
                    <h1>{listing.name}</h1>
                    <div className="buy-tag condition-buy" style={{ "backgroundColor": "#1CE79E" }}><p>{listing.condition}</p></div>
                    <div className="buy-tag" style={{ "backgroundColor": "#F3819C" }}><p>{listing.comp}</p></div>
                    {
                      listing.brand !== "Other" &&
                      <div className="buy-tag" style={{ "backgroundColor": "#FF5555" }}><p>{listing.brand}</p></div>
                    }
                  </section>

                  <section>
                    <h2>${listing.price} - {listing.city}</h2>
                    <h2>{listing.ship}</h2>
                  </section>

                  <section>
                    <p>{ listing.description }</p>
                  </section>
                </article>

                {
                  listing.picture !== null ?
                  <img src={ listing.picture } alt="uploaded by user"/> :
                  <Icon icon="carbon:no-image" height="30vh" /> }
              </article>
            </Link>
          ))
        }

        {/* <Link className="buy-link">
          <article className="listing-buy">
            <article>
              <section>
                <h1>Flywheelasdasdasdasdasdasdasdasdasdasasdasdasd</h1>
                <div className="buy-tag" style={{ "background-color": "#1CE79E" }}><p>Used</p></div>
                <div className="buy-tag" style={{ "background-color": "#F3819C" }}><p>FTC</p></div>
              </section>

              <section>
                <h2>$200 - Sammamish WA</h2>
                <h2>Shipped</h2>
              </section>

              <section>
                <p>
                  This flywheel has all the fetures of an excellent flywhell.
                  It has a wheel, a motor, and an axel. And it even comes pre-assembled!!!
                  This flywheel has all the fetures of an excellent flywhell.
                  It has a wheel, a motor, and an axel. And it even comes pre-assembled!!!
                  This flywheel has all the fetures of an excellent flywhell.
                  It has a wheel, a motor, and an axel. And it even comes pre-assembled!!!
                </p>
              </section>
            </article>

            <img src={lake} alt="lake"/>
          </article>
        </Link> */}
      </section>
    </div>
  )
}

export default Buy;