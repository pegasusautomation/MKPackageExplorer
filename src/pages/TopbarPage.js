import React from "react";
// import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
// import HomePage from "./HomePage";
// import Servertable from "C:/Mediaroom/src/manageserver/servertable.js";
// import LoginPage from "./LoginPage";
// import { useHistory } from "react-router-dom";
import "./topbar.css"

const Topbar = () => {
  // const history = useHistory();
  // const handleSubmit = () => {
  //   history.push("/LoginPage");
  //   window.location.reload();
  // };

  return (
    <div className="topbar">
      <span>
        Welcome
      </span>

      {/* <button type="submit" onClick={handleSubmit}>
        Log out
      </button> */}
      {/* <Link to="/login">Logout</Link> */}
    </div>
  );
};

export default Topbar;