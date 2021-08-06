import "./contact.css";
import { useState } from "react";
import { collection, Timestamp, getFirestore, addDoc  } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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
const formSubmissions = collection(db, "contact-form-submissions");

function Contact() {
  const [formValue, setFormValue] = useState({name: "", email: "", question: ""});
  const [disabled, setDisabled] = useState(false);

  async function addQuestion(form) {
    form.preventDefault();
    setDisabled(true);
    await addDoc(formSubmissions, {
      to: "contact.firstmarketplace@gmail.com",
      message: {
        subject: "Question from" + formValue.name,
        text: "Name: " + formValue.name + "\nEmail: " + formValue.email + "\nQuestion: " + formValue.question
      },
      time: Timestamp.now()
    });

    setFormValue({name: "", email: "", question: ""});
    setDisabled(false);
  }

  return (
    <div className="contact">
      <form onSubmit={addQuestion}>
        <article>
          <h1>Questions? Contact us Below</h1>
            <input value={formValue.name} type="text" placeholder="Team Name or First Name" required
             onChange={(value) => setFormValue({name: value.target.value,
                                                email: formValue.email,
                                                question: formValue.question})}/>

            <input value={formValue.email} type="text" placeholder="Email Address" required
              onChange={(value) => setFormValue({name: formValue.name,
                          email: value.target.value,
                          question: formValue.question})}/>
            <textarea value={formValue.question} placeholder="Type your message here" required
              onChange={(value) => setFormValue({name: formValue.name,
                            email: formValue.email,
                            question: value.target.value})} />
          <button disabled={disabled}>Submit</button>
        </article>
      </form>
    </div>
  );
}

export default Contact;