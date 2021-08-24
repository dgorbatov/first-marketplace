import "./submitted.css"
import { useHistory, useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
import { useEffect } from "react";

function Submitted() {
  const history = useHistory();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }


  let query = useQuery();

  useEffect(() => {
    setTimeout(() => {
      history.push(query.get("url"))
    }, 1000);
  }, [query, history]);

  return (
    <div className="submitted">
      <Icon icon="eva:checkmark-circle-2-outline" className="submitted-check" height="40vh" />
      <p>Thank You!</p>
      <p>{useQuery().get("message")}</p>
    </div>
  );
}

export default Submitted;