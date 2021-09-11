import "./add.css";
import config from "../../../extra/config"
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { useState, useRef } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import { getFirestore, updateDoc, Timestamp, addDoc, collection, doc, arrayUnion, getDoc } from "firebase/firestore";
import { Icon } from '@iconify/react';

initializeApp(config);
const storage = getStorage();
const db = getFirestore();

function Add(props) {
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
  const quantity = useRef(1);
  const [country, setCountry] = useState("");
  const [shippingCost, setShippingCost] = useState("");
  const [shippingTime, setShippingTime] = useState("");
  const [showDelivery, setShowDelivery] = useState(false);
  const [comp, setComp] = useState(null);
  const [condition, setCondition] = useState(null);
  const [brand, setBrand] = useState(null);
  const [error, setError] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editPictures, setEditPictures] = useState([]);
  const [newPics, setNewPics] = useState(false);
  const [picArr, setPicArr] = useState([]);
  const [currency, setCurrency] = useState("$");
  const [request, setRequest] = useState(false);

  useState(async () => {
    if (id !== "new") {
      // Edit page
      setEdit(true);
      await fillInFields();
    } else if (email.target !== "") {
        setCountry(props.country);
    }

    async function fillInFields() {
      setLoading(true);
      const docSnap = await getDoc(doc(db, "listings", id));
      setLoading(false);

      if (!docSnap.exists())
        history.push("error/404");

      const data = docSnap.data();

      if (name.current !== "") {
        name.current.value = data.basicinfo.name;
        city.current.value = data.basicinfo.city;
        price.current.value = data.basicinfo.price;
        email.current.value = data.basicinfo.email;
        description.current.value = data.basicinfo.description;
        setCurrency(data.basicinfo.currency);

        if (data.basicinfo.quantity !== undefined)
          quantity.current.value = data.basicinfo.quantity;
        if (data.basicinfo.country !== undefined)
          setCountry(data.basicinfo.country);

        spec.current.value = data.basicinfo.spec;
        delivery.current.checked = data.shipping.delivery;
        pickup.current.checked = data.shipping.pickup;
        setShippingCost(data.shipping.shippingCost);
        setShippingTime(data.shipping.shippingTime);
        url.current.value = data.url;
        setEditPictures(data["picture_urls"]);
        setComp(data.tags.comp);
        setCondition(data.tags.condition);
        setBrand(data.tags.brand);
        setPicArr(data.pictures);

        if (data.req !== undefined) {
          setRequest(data.req);
        }
      }
    }
  }, []);

  function handleErrors() {
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
    setLoading(true);

    await updateDoc(doc(db, "listings", id), {
      basicinfo: {
        name: name.current.value,
        city: city.current.value,
        country: country,
        price: price.current.value,
        email: email.current.value,
        description: description.current.value,
        spec: spec.current.value,
        quantity: quantity.current.value,
        currency: currency
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
      "update-time": Timestamp.now(),
      status: "a",
      uid: props.uid,
      url: url.current.value
    });

    if (newPics) {
      for (let i of picArr) {
        await deleteObject(ref(storage, i));
      }

      let picture_urls = await uploadPics(id);
      setPictures([]);

      await updateDoc(doc(db, "listings", id), {
        pictures: picture_urls[0],
        "picture_urls": picture_urls[1]
      });
    }

    setLoading(false);
    history.push("/e/submitted?message=Your%20Product%20has%20been%20Edited&url=/ms/sell/menu");
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
        country: country,
        price: price.current.value,
        email: email.current.value,
        description: description.current.value,
        spec: spec.current.value,
        quantity: quantity.current.value,
        currency: currency
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
      uid: props.uid,
      url: url.current.value,
      req: request
    });

    let picture_urls = await uploadPics(list_doc.id);
    setPictures([]);

    await updateDoc(list_doc, {
      pictures: picture_urls[0],
      "picture_urls": picture_urls[1]
    });

    await updateDoc(doc(db, "user-info", props.uid), {
      listings: arrayUnion(list_doc.id)
    });

    setLoading(false);
    history.push("/e/submitted?message=Your%20Product%20has%20been%20Posted&url=/ms/sell/menu");
  }

  async function uploadPics(docName) {
    let urls = [];
    let web_urls = [];

    pictures.map(file => {
      urls.push(props.uid + "/" + docName + "/" + file.name);
      return null;
    })

    for (let file of pictures) {
      await uploadBytes(ref(storage, props.uid + "/" + docName + "/" + file.name), file);
      const url = await getDownloadURL(ref(storage, props.uid + "/" + docName + "/" + file.name));
      web_urls.push(url);
    }

    return [urls, web_urls];
  }

  return (
    <div className={props.mode === "l" ? "add light-add" : "add dark-add"}>
      {loading && <Icon icon="eos-icons:bubble-loading" height="30vh" width="30vw" className="loading"/>}
      { !loading && (edit ? <p>Edit Listing</p> : <p>Create A New Listing</p>)}
      { !loading &&
        <article>
          <form onSubmit={handleSubmit}>
            { !edit && <section className="req">
              <article>
                <input type="radio" name="req" checked={request}
                  onChange={() => setRequest(true) }/>
                <label>Request</label>
              </article>

              <article>
                <input type="radio" name="req" checked={!request}
                  onChange={() => setRequest(false) }/>
                <label>Listing</label>
              </article>
            </section>}

            <section className="add-listing-centered">
              <input type="text" required placeholder="Product Name*" ref={name}/>
              <input type="text" required placeholder="City/State*" ref={city}/>
              <input type="text" required placeholder="Country*" value={country}
                onChange={val => setCountry(val.target.value)}/>
              <section className="currency-input">
                <select name="" value={currency} onChange={val => setCurrency(val.target.value)}>
                  <option value="$">United States Dollars</option>
                  <option value="€">Euro</option>
                  <option value="£">United Kingdom Pounds</option>
                  <option value="AU$">Australian dollar</option>
                  <option value="CA$">Canadian dollar</option>
                  <option value="CHf">Swiss franc</option>
                  <option value="¥">Chinese renminbi</option>
                  <option value="HK$">Hong Kong dollar</option>
                  <option value="NZ$">New Zealand dollar</option>
                </select>
                <input type="number" required placeholder="Price*" ref={price} step="0.01" min="0.00"/>
              </section>
              <input type="email" required placeholder="Email Address*" ref={email}/>
              <input type="url" placeholder="Original URL of Product" ref={url}/>
              <input type="number" placeholder="Quantity*" ref={quantity} min="1" required/>
            </section>

            <section className="add-listing-centered">
              <textarea minLength={10} maxLength={1000} required ref={description} placeholder="Description/Extra Details*" />
              <textarea maxLength={1000} ref={spec} placeholder="Specifications" />
            </section>

            { !request && <section className="upload-pictures">
              <article>
                <label className="custom-file-upload">
                  <input type="file" accept="image/*" multiple onChange={(file) => { setNewPics(true); setEditPictures([]); setPictures(Object.values(file.target.files)); } }/>
                  Add Pictures
              </label>
              </article>

              {pictures.map((file, index) => (
                <img src={URL.createObjectURL(file)} alt="upload by user" key={index}
                onClick={() => {
                  // let new_pics = pictures;
                  // new_pics.splice(index, 1);
                  // setPictures(new_pics);
                }}/>
              ))}

              {editPictures.map((file, index) => (
                <img src={file} alt="upload by user" key={index+5}/>
              ))}
            </section>}

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

              { (showDelivery && !request) &&
                <input type="number" required placeholder="Shipping Cost*" value={shippingCost}
                  onChange={(v) => setShippingCost(v.target.value) }/>
              }
              { (showDelivery && !request) &&
                <input type="text" required placeholder="Shipping Speed*"value={shippingTime}
                onChange={(val) => setShippingTime(val.target.value) }/>
              }
            </section>

            { !request && <section className="add-listing-left">
              <p>Tags*</p>

              <section className="tags">
                <section>
                  <p>League</p>

                  <article>
                    <input type="radio" name="comp" checked={comp === "FLL"}
                      onChange={() => setComp("FLL") }/>
                    <label>FLL</label>
                  </article>

                  <article>
                    <input type="radio" name="comp" checked={comp === "FTC"}
                      onChange={() => setComp("FTC") }/>
                    <label>FTC</label>
                  </article>

                  <article>
                    <input type="radio" name="comp" checked={comp === "FRC"}
                      onChange={() => setComp("FRC")}/>
                    <label>FRC</label>
                  </article>
                </section>

                <section>
                  <p>Condition</p>

                  <article>
                    <input type="radio" name="condition" checked={condition === "New"}
                      onChange={() => setCondition("New") }/>
                    <label>New</label>
                  </article>

                  <article>
                    <input type="radio" name="condition" value="Used" checked={condition === "Used"}
                      onChange={() => setCondition("Used") }/>
                    <label>Used</label>
                  </article>

                  <article>
                    <input type="radio" name="condition" value="Sort of new" checked={condition === "Sort of new"}
                      onChange={() => setCondition("Sort of new")}/>
                    <label>Sort Of Used</label>
                  </article>
                </section>

                <section>
                  <p>Brand</p>

                  <article>
                    <input type="radio" name="brand" checked={brand === "REV"}
                      onChange={() => setBrand("REV") }/>
                    <label>REV</label>
                  </article>

                  <article>
                    <input type="radio" name="brand" checked={brand === "Andymark"}
                      onChange={() => setBrand("Andymark") }/>
                    <label>Andymark</label>
                  </article>

                  <article>
                    <input type="radio" name="brand" checked={brand === "Gobuilda"}
                      onChange={() => setBrand("Gobuilda")}/>
                    <label>Gobuilda</label>
                  </article>
                </section>

                <section className="brands-continue">
                  <p>{"<--"}</p>
                  <article>
                    <input type="radio" name="brand" checked={brand === "PITSCO"}
                      onChange={() => setBrand("PITSCO") }/>
                    <label>PITSCO </label>
                  </article>

                  <article>
                    <input type="radio" name="brand" checked={brand === "EV3"}
                      onChange={() => setBrand("EV3") }/>
                    <label>EV3</label>
                  </article>

                  <article>
                    <input type="radio" name="brand" checked={brand === "Other"}
                      onChange={() => setBrand("Other")}/>
                    <label>Other</label>
                  </article>
                </section>
                </section>
            </section> }

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
