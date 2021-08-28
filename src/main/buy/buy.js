import "./buy.css"
import config from "../../extra/config"
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
import { Icon } from '@iconify/react';
import FLL from "../../assets/fll.png";
import FTC from "../../assets/ftc.png";
import FRC from "../../assets/frc.png";

initializeApp(config);
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
        if (i.description.toLowerCase().includes(props.query.trim().toLowerCase())
            && !resulting_listings.includes(i))
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

      let abbreviation = "";
      if (list[1].basicinfo.country !== undefined) {
        for (let i of list[1].basicinfo.country.split(" ")) {
          abbreviation += i[0]
        }
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
        country: list[1].basicinfo.country,
        country_abbreviation: abbreviation,
        currency: list[1].basicinfo.currency
      });
    }

    return res;
  }

  return (
    <div className={props.mode === "l" ? "buy light-buy" : "buy dark-buy"}>
      <section>
        { listings.length === 0 && <h1>No Listings Found</h1>}
        { props.mode === "l" ?
          listings.map((listing, index) => (
            <Link className="buy-link" key={index} to={"/ms/item/" + listing.key}>
              {listing.comp === "FLL" && <img src={FLL} alt="FLL Logo" className="comp-img"/>}
              {listing.comp === "FTC" && <img src={FTC} alt="FLL Logo" className="comp-img"/>}
              {listing.comp === "FRC" && <img src={FRC} alt="FLL Logo" className="comp-img"/>}

              <article className="listing-buy">
                <article>
                  <section className="buy-top">
                    <h1>{listing.name}</h1>
                    <h1>{listing.condition}</h1>
                    <h1>{listing.currency + listing.price}</h1>
                  </section>

                  <section>
                    <h2>{listing.city + (listing.country !== undefined ? " - " + listing.country : "")}</h2>
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
          :
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
                    <h2>{listing.currency + listing.price} - {listing.city}
                        {listing.country !== undefined && ( " - " +
                        listing.country_abbreviation)}</h2>
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