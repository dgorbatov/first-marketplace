import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./team.css";
import config from "../../extra/config";
import { initializeApp } from "@firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";

initializeApp(config);
const db = getFirestore();

function Team() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function getData() {
      const docSnap = await getDoc(doc(db, "user-info/" + id + "/profile/info"))
      if (!(docSnap.exists())) {
        history.push("/error/404");
      }
      setTeam(docSnap.data());
    }

    getData();
  }, [id, history]);


  return (
    <div className="team">
      {team !== null && <article>
        <section className="pfp">
          <img src={team.pfp} alt="Team PFP" />
          <p>{team.name}</p>
        </section>

        <section className="team-info-page">
          <h1>Info:</h1>
          <p>Location: {team.city}, {team.country}</p>
          <p>Competition: {team.comp}</p>
          <p>Rookie year: {team.creat} </p>
          <p>Number of Team Members: {team["num-mem"]}</p>
          <p>Team Number: {team.number}</p>
          <p>Description: {team.description}</p>
        </section>
      </article>}
    </div>
  );
}

export default Team;