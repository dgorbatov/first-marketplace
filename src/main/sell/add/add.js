import "./add.css";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useState, useRef } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";

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

function Add() {
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const name = useRef("");
  const city = useRef("");
  const price = useRef(0.00);
  const email = useRef("");
  const description = useRef("");
  const spec = useRef("");
  const delivery = useRef(false);
  const pickup = useRef(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [comp, setComp] = useState(null);
  const [condition, setCondition] = useState(null);
  const [brand, setBrand] = useState(null);
  const [error, setError] = useState(null);
  const [pictures, setPictures] = useState([]);

  onAuthStateChanged(auth, async user => {
    if (user) {
      if (id !== "new") {
        // Edit page
        setEdit(true);
      }
    } else {
      history.push("/ss/ls/login");
    }
  });

  function handleSubmit(form) {
    form.preventDefault();

    if (comp == null || brand == null || condition == null) {
      setError("Please select a league, condition, and brand");
      return;
    }

    console.log(comp);
    console.log(brand);
    console.log(condition);

    if (!delivery.current.checked && !pickup.current.checked) {
      setError("Please check ether local pickup or shipping");
      return;
    }

    setError("");
  }

  function uploadPic(file) {
    const storageRef = ref(storage, URL.createObjectURL(file.target.files[0]));

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file.target.files[0]).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      setPictures(pictures.push(URL.createObjectURL(file.target.files[0])));
      console.log(pictures);
    });
  }

  return (
    <div className="add">
      {edit ? <p>Edit Listing</p> : <p>Create A New Listing</p>}
      <article>
        <form onSubmit={handleSubmit}>
          <section className="add-listing-centered">
            <input type="text" required placeholder="Name*" ref={name}/>
            <input type="text" required placeholder="City*" ref={city}/>
            <input type="number" required placeholder="Price(USD)*" ref={price}/>
            <input type="email" required placeholder="Email Address*" ref={email}/>
          </section>

          <section className="add-listing-centered">
            <textarea minLength={10} maxLength={1000} required ref={description} placeholder="Description/Extra Details*" />
            <textarea maxLength={1000} ref={spec} placeholder="Specifications" />
          </section>

          <section className="upload-pictures">
            <article>
              <label className="custom-file-upload">
                <input type="file" multiple onChange={uploadPic}/>
                Add A Picture
            </label>
            </article>

            {pictures.map(file => (
              <img src={file} alt="upload by user" key={file}/>
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
              <input type="number" required placeholder="Shipping Cost*"/>
            }
            { showDelivery &&
              <input type="text" required placeholder="Shipping Speed*"/>
            }
          </section>

          <section className="add-listing-left">
            <p>Tags</p>

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
    </div>
  );
}

export default Add;