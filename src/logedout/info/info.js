import "./info.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useHistory, Link } from "react-router-dom";
import { doc, getDoc, setDoc, getFirestore  } from "firebase/firestore";
import { useState, useMemo  } from "react";
import { initializeApp } from "firebase/app";
import { Icon } from '@iconify/react';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import config from "../../extra/config";
import SelectUSState from 'react-select-us-states';

initializeApp(config);
const db = getFirestore();
const auth = getAuth();


function Info() {
  const [name, setName ] = useState("");
  const [num, setNum ] = useState("");
  const [year, setYear ] = useState("");
  const [numMem, setNumMem ] = useState("");
  const [comp, setComp ] = useState("FLL");
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("AL");
  const options = useMemo(() => countryList().getData(), [])
  const history = useHistory();

  onAuthStateChanged(auth, async user => {
    if (user) {
      const docRef = doc(db, "user-info", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        history.push("/");
      }
      setLoading(false);
    } else {
      history.push("/");
    }
  });

  async function addTeam(form) {
    form.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    let state_new = "";
    if (country !== "" && country.value === "US")
      state_new = state;

    await setDoc(doc(db, "user-info", user.uid), {
      name: name,
      number: num,
      "num-mem": numMem,
      program: comp.label,
      "team-creation-year": year,
      listings: [],
      country: country,
      mode: "l",
      city: city,
      state: state_new
    });

    setLoading(false);
    history.push("/");
  }

  return (
    <div className="info">
      {loading ? <Icon icon="eos-icons:bubble-loading" height="30vh" width="30vw" className="loading"/>
      : <article>
        <form onSubmit={addTeam}>
          <h1>Additional Team Information</h1>
            <section>
              <input type="text" required placeholder="Team Name*" value={name}
                onChange={(val) => { setName(val.target.value); }}/>
              <input type="number" required placeholder="Team Number*" value={num}
                onChange={(val) => { setNum(val.target.value); }}/>
              <input type="number" required placeholder="Team Founding Year*" value={year}
                onChange={(val) => { setYear(val.target.value); }}/>
              <input type="number" required placeholder="Number of Team Members*" value={numMem}
                onChange={(val) => { setNumMem(val.target.value); }}/>
              <input type="text" required placeholder="City*" value={city}
                onChange={(val) => { setCity(val.target.value); }}/>
              { country !== "" && country.value === "US" && <SelectUSState className="info-states" onChange={val => setState(val)}/> }
              <Select className="select-info" options={options} value={country} onChange={value => {
                setCountry(value)
              }} />

              <Select className="select-info"
              options={[{value: "FLL", label: "FLL"}, {value: "FTC", label: "FTC"}, {value: "FRC", label: "FRC"}]} value={comp}
              onChange={value => {
                setComp(value)
              }} />

              <section className="privacy-policy-info">
                <input type="checkbox" required/>
                <p>I agree to the <Link to="/ss/privacypolicy">Privacy Policy</Link></p>
              </section>
            </section>
          <button>Create Team</button>
        </form>
      </article> }
    </div>
  );
}

export default Info;