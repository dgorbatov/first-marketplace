import "./contact.css";
import { useState } from "react";
import firebase from 'firebase/app';
import 'firebase/firestore';

function Contact() {
  const [formValue, setFormValue] = useState({name: "", email: "", question: ""});
  const [disabled, setDisabled] = useState(false);
  firebase.app();
  const firestore = firebase.firestore();
  const formSubmissions = firestore.collection("contact-form-submissions");

  async function addQuestion(form) {
    form.preventDefault();
    setDisabled(true);
    console.log(formValue);
    await formSubmissions.add({
      name: formValue.name,
      email: formValue.email,
      question: formValue.question,
      time: firebase.firestore.FieldValue.serverTimestamp()
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