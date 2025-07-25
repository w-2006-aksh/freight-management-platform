import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import LoginAs from "./Components/LoginAs";
import Navbar from "./Components/Navbar.jsx";
import LoginAsClient from "./Components/client/Login.jsx";
import LoginAsTransporter from "./Components/transporter/Login.jsx";
import SignUpAsClient from "./Components/client/Signup.jsx";
import SignUpAsTransporter from "./Components/transporter/Signup.jsx";
import SignUpAs from "./Components/SignUpAs.jsx";
import PostABid from "./Components/client/PostABid.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeAuthenticationStatus, setUser } from "./redux/slices/user.js";
import TransporterBids from "./Components/transporter/Bids.jsx";
import ClientBids from "./Components/client/Bids.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PostAQuote from "./Components/transporter/PostAQuote.jsx";
import SeeQuotes from "./Components/client/SeeQuotes.jsx";
import UploadDetails from "./Components/transporter/UploadTransportDetails.jsx";
import Details from "./Components/client/Details.jsx";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          method: "GET",
        });
        const data = await res.json();
        console.log(data);
        if (data.success) {
          dispatch(changeAuthenticationStatus(true));
          dispatch(setUser(data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div className="pt-[75px] bg-gray-200 w-screen h-screen">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/loginAs" element={<LoginAs />}></Route>
          <Route path="/loginAsClient" element={<LoginAsClient />}></Route>
          <Route
            path="/loginAsTransporter"
            element={<LoginAsTransporter />}
          ></Route>
          <Route
            path="/signUpAsTransporter"
            element={<SignUpAsTransporter />}
          ></Route>
          <Route path="/signUpAsClient" element={<SignUpAsClient />}></Route>
          <Route path="/signUpAs" element={<SignUpAs />}></Route>
          <Route path="/client/postABid" element={<PostABid />}></Route>
          <Route path="/transporter/bids" element={<TransporterBids />}></Route>
          <Route path="/client/bids" element={<ClientBids />}></Route>
          <Route
            path="/transporter/:bidNo/postAQuote"
            element={<PostAQuote />}
          ></Route>
          <Route
            path="/client/:bidId/seeQuotes"
            element={<SeeQuotes />}
          ></Route>
          <Route
            path="/transporter/:bidId/uploadDetails"
            element={<UploadDetails />}
          ></Route>
          <Route path="/client/:bidId/Details" element={<Details />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
