import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./team.css";
import config from "../../extra/config";
import { initializeApp } from "@firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";

initializeApp(config);
const db = getFirestore();

function Team() {
  const { id } = useParams();

  useEffect(() => {
    async function getData() {
      const docSnap = await getDoc(doc(db, "user-info/" + id + "/profile/info"))
      console.log(docSnap.data());
    }

    getData();
  }, [id]);


  return (
    <div className="team">
      <p>Hello World!</p>
    </div>
  );
}

export default Team;