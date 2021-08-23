import "./add.css";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useState, useRef } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore, updateDoc, Timestamp, addDoc, collection, doc, arrayUnion } from "firebase/firestore";
import Check from "../../../assets/check.png";
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
const auth = getAuth();
const storage = getStorage();
const db = getFirestore();

function Add() {
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const name = useRef("");
  const url = useRef("");
  const city = useRef("");
  const price = useRef(0.00);
  const email = useRef("");
  const description = useRef("");
  const spec = useRef("");
  const delivery = useRef(false);
  const pickup = useRef(false);
  const [shippingCost, setShippingCost] = useState("");
  const [shippingTime, setShippingTime] = useState("");
  const [showDelivery, setShowDelivery] = useState(false);
  const [comp, setComp] = useState(null);
  const [condition, setCondition] = useState(null);
  const [brand, setBrand] = useState(null);
  const [error, setError] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [uid, setUid] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);


  onAuthStateChanged(auth, async user => {
    if (user) {
      if (id !== "new") {
        // Edit page
        setEdit(true);
      }
      setUid(user.uid);
    } else {
      history.push("/ss/ls/login");
    }
  });

  function handleErrors() {
    if (comp == null || brand == null || condition == null) {
      setError("Please select a league, condition, and brand");
      return -1;
    }

    if (pictures.length > 5) {
      setError("No More Than 5 Pictures allowed");
      return -1;
    }

    if (!delivery.current.checked && !pickup.current.checked) {
      setError("Please check ether local pickup or shipping");
      return -1;
    }

    setError("");
    return 0;
  }

  async function editDoc() {
    console.error("NOT IMPLEMENTED YET");
  }

  async function handleSubmit(form) {
    form.preventDefault();
    setLoading(true);

    if (edit) {
      editDoc();
      return;
    }

    if (handleErrors() !== 0)
      return;

    const list_doc = await addDoc(collection(db, "listings"), {
      basicinfo: {
        name: name.current.value,
        city: city.current.value,
        price: price.current.value,
        email: email.current.value,
        description: description.current.value,
        spec: spec.current.value
      },
      shipping : {
        delivery: delivery.current.checked,
        pickup: pickup.current.checked,
        shippingCost: shippingCost,
        shippingTime: shippingTime
      },
      tags : {
        comp: comp,
        condition: condition,
        brand: brand
      },
      "create-time": Timestamp.now(),
      status: "a",
      uid: uid,
      url: url.current.value
    });

    let picture_urls = await uploadPics(list_doc.id);
    // let picture_urls = await uploadPics("TESTING_SUIT");
    // console.log(picture_urls);
    setPictures([]);

    // for (let i of picture_urls[1]) {
    //   console.log(i)
    // }

    await updateDoc(list_doc, {
      pictures: picture_urls[0],
      "picture_urls": picture_urls[1]
    });

    await updateDoc(doc(db, "user-info", uid), {
      listings: arrayUnion(list_doc.id)
    });

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => history.push("/ms/sell/menu"), 1000);
  }

  async function uploadPics(docName) {
    let urls = [];
    let web_urls = [];

    pictures.map(file => {
      urls.push(uid + "/" + docName + "/" + file.name);
      return null;
    })

    for (let file of pictures) {
      await uploadBytes(ref(storage, uid + "/" + docName + "/" + file.name), file);
      const url = await getDownloadURL(ref(storage, uid + "/" + docName + "/" + file.name));
      web_urls.push(url);
    }

    // await pictures.map(async file => {
    //   await uploadBytes(ref(storage, uid + "/" + docName + "/" + file.name), file);
    //   const url = await getDownloadURL(ref(storage, uid + "/" + docName + "/" + file.name));
    //   web_urls.push(url);
    //   return null;
    // })

    return [urls, web_urls];
  }

  return (
    <div className="add">
      {loading && <Icon icon="eos-icons:bubble-loading" height="30vh" width="30vw" className="loading"/>}
      { !submitted && !loading && (edit ? <p>Edit Listing</p> : <p>Create A New Listing</p>)}
      { submitted && !loading &&
        <div className="add-submitted">
          <img src={Check} alt="Check Mark" />
          <p>Thank You!</p>
          <p>Your Product has been Posted</p>
        </div>
      }
      { !loading &&
        <article>
          <form onSubmit={handleSubmit}>
            <section className="add-listing-centered">
              <input type="text" required placeholder="Product Name*" ref={name}/>
              <input type="text" required placeholder="City*" ref={city}/>
              <input type="number" required placeholder="Price(USD)*" ref={price}/>
              <input type="email" required placeholder="Email Address*" ref={email}/>
              <input type="url" placeholder="Original URL of Product" ref={url}/>
            </section>

            <section className="add-listing-centered">
              <textarea minLength={10} maxLength={1000} required ref={description} placeholder="Description/Extra Details*" />
              <textarea maxLength={1000} ref={spec} placeholder="Specifications" />
            </section>

            <section className="upload-pictures">
              <article>
                <label className="custom-file-upload">
                  <input type="file" accept="image/*" multiple onChange={(file) => { setPictures(Object.values(file.target.files)); } }/>
                  Add Pictures
              </label>
              </article>

              {pictures.map((file, index) => (
                <img src={URL.createObjectURL(file)} alt="upload by user" key={index}
                onClick={() => {
                  let new_pics = pictures;
                  new_pics.splice(index, 1);
                  setPictures(new_pics);
                }}/>
              ))}
            </section>

            <section className="add-listing-left">
              <p>Delivery options*</p>

              <section>
                <input type="checkbox" ref={pickup}/>
                <label>Local Pickup</label>
              </section>

              <section>
                <input type="checkbox" ref={delivery} onChange={() => { setShowDelivery(delivery.current.checked) }} />
                <label>Shipping</label>
              </section>

              { showDelivery &&
                <input type="number" required placeholder="Shipping Cost*" value={shippingCost}
                  onChange={(v) => setShippingCost(v.target.value) }/>
              }
              { showDelivery &&
                <input type="text" required placeholder="Shipping Speed*"value={shippingTime}
                onChange={(val) => setShippingTime(val.target.value) }/>
              }
            </section>

            <section className="add-listing-left">
              <p>Tags*</p>

              <section className="tags">
                <section>
                  <p>League</p>

                  <article>
                    <input type="radio" name="comp"
                      onChange={() => setComp("FLL") }/>
                    <label>FLL</label>
                  </article>

                  <article>
                    <input type="radio" name="comp"
                      onChange={() => setComp("FTC") }/>
                    <label>FTC</label>
                  </article>

                  <article>
                    <input type="radio" name="comp"
                      onChange={() => setComp("FRC")}/>
                    <label>FRC</label>
                  </article>
                </section>

                <section>
                  <p>Condition</p>

                  <article>
                    <input type="radio" name="condition"
                      onChange={() => setCondition("New") }/>
                    <label>New</label>
                  </article>

                  <article>
                    <input type="radio" name="condition" value="Used"
                      onChange={() => setCondition("Used") }/>
                    <label>Used</label>
                  </article>

                  <article>
                    <input type="radio" name="condition" value="Sort of new"
                      onChange={() => setCondition("Sort of new")}/>
                    <label>Sort Of Used</label>
                  </article>
                </section>

                <section>
                  <p>Brand</p>

                  <article>
                    <input type="radio" name="brand"
                      onChange={() => setBrand("REV") }/>
                    <label>REV</label>
                  </article>

                  <article>
                    <input type="radio" name="brand"
                      onChange={() => setBrand("Andymark") }/>
                    <label>Andymark</label>
                  </article>

                  <article>
                    <input type="radio" name="brand"
                      onChange={() => setBrand("Gobuilda")}/>
                    <label>Gobuilda</label>
                  </article>
                </section>

                <section className="brands-continue">
                  <p>{"<--"}</p>
                  <article>
                    <input type="radio" name="brand"
                      onChange={() => setBrand("PITSCO ") }/>
                    <label>PITSCO </label>
                  </article>

                  <article>
                    <input type="radio" name="brand"
                      onChange={() => setBrand("Tetrix") }/>
                    <label>Tetrix</label>
                  </article>

                  <article>
                    <input type="radio" name="brand"
                      onChange={() => setBrand("Other")}/>
                    <label>Other</label>
                  </article>
                </section>
                </section>
            </section>

            {edit ? <button>Publish Changes</button> : <button>Post</button>}
            <p className="add-error">{error}</p>
            <p>* = required</p>
          </form>
        </article>
      }
    </div>
  );
}

export default Add;
