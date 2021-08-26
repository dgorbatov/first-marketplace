import "./buy.css"
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
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

function Buy(props) {
  const [listings, setListings] = useState([]);
  const [fullListings, setFullListings] = useState([]);

  const compListings = useCallback((list1, list2) => {
    if (props.country === "")
      return 0;
    if (list1.country === props.country)
      return -1;
    if (list2.country === props.country)
      return 1;
    return 0;
  }, [props.country]);

  useEffect(() => {
    onSnapshot(collection(db, "listings"), getListings);

    async function getListings(docs)  {
      let new_listings = []

      docs.forEach(doc => {
        if (doc.data().status === "a")
          new_listings.push([doc.id, doc.data()]);
      });

      new_listings = await modifyListings(new_listings);

      setFullListings(new_listings);
      new_listings.sort(compListings);
      setListings(new_listings);
    }

  }, [compListings]);

  useEffect(() => {
    if (props.query === null)
      return;
    if (props.query === "")
      setListings(fullListings);
    else {
      let resulting_listings = [];

      for (let i of fullListings) {
        if (i.name.toLowerCase().includes(props.query.trim().toLowerCase()))
          resulting_listings.push(i);
      }

      for (let i of fullListings) {
        if (i.description.toLowerCase().includes(props.query.trim().toLowerCase()))
          resulting_listings.push(i);
      }

      resulting_listings.sort(compListings);
      setListings(resulting_listings);
    }
  }, [props.query, fullListings, compListings]);

  async function modifyListings(listings_modify) {
    let res = []

    for (let list of listings_modify) {
      let shipping = "";

      if (list[1].shipping.delivery)
        shipping += "Shipped"
      if (list[1].shipping.pickup) {
        if (shipping !== "")
          shipping += "/"
        shipping += "Local"
      }

      let picture = null;
      if (list[1]["picture_urls"] !== undefined && list[1]["picture_urls"][0] !== undefined) {
        picture = list[1]["picture_urls"][0];
      }

      res.push({
        key: list[0],
        city: list[1].basicinfo.city,
        description: list[1].basicinfo.description,
        name: list[1].basicinfo.name,
        price: list[1].basicinfo.price,
        picture: picture,
        ship: shipping,
        brand: list[1].tags.brand,
        condition: list[1].tags.condition,
        comp: list[1].tags.comp,
        country: list[1].basicinfo.country
      });
    }

    return res;
  }

  return (
    <div className="buy">
      <section>
        {
          listings.map((listing, index) => (
            <Link className="buy-link" key={index} to={"/ms/item/" + listing.key}>
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

                    {
                      listing.country !== undefined &&
                      <div className="buy-tag" style={{ "backgroundColor": "#37D3F5" }}><p>{listing.country}</p></div>
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
      </section>
    </div>
  )
}

export default Buy;