import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarDiown from "./components/NavbarDiown.js";
import { Route, Routes, useLocation } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import Home from "./pages/Home";
import React, { useState, useEffect } from "react";
import Event from "./pages/Event";
import Pentition from "./pages/Petition";
import UserMarker from "./pages/UserMarker";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";

function App() {
  const [checkNav, setCheckNav] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (window.location.pathname !== "/") {
      setCheckNav(true);
    } else {
      setCheckNav(false);
    }
  }, [location]);
  return (
    <div>
      {checkNav === true ? <NavbarDiown /> : <div></div>}
      <Routes>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/event" element={<Event />}></Route>
        <Route path="/petition" element={<Pentition />}></Route>
        <Route path="/UserMarker" element={<UserMarker />}></Route>
        <Route path="/addEvent" element={<AddEvent />}></Route>
        <Route path="/editEvent" element={<EditEvent />}></Route>
      </Routes>
    </div>
  );
}

export default App;
