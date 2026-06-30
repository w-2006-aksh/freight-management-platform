import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import LoginAs from "./Components/LoginAs";
import Navbar from "./Components/Navbar.jsx";
import Login from "./Components/Login.jsx";
import SignUpAsClient from "./Components/client/Signup.jsx";
import SignUpAsTransporter from "./Components/transporter/Signup.jsx";
import SignUpAs from "./Components/SignUpAs.jsx";
import PostABid from "./Components/client/PostABid.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeAuthenticationStatus, setUser } from "./redux/slices/user.js";
import TransporterBids from "./Components/transporter/Bids.jsx";
import ClientBids from "./Components/client/Bids.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PostAQuote from "./Components/transporter/PostAQuote.jsx";
import SeeQuotes from "./Components/client/SeeQuotes.jsx";
import UploadDetails from "./Components/transporter/UploadTransportDetails.jsx";
import Details from "./Components/client/Details.jsx";
import JourneyTracking from "./Components/client/JourneyTracking.jsx";
import ManageTrustedTransporters from "./Components/client/ManageTrustedTransporters.jsx";

function App() {
  const dispatch = useDispatch();
  const userSlice = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
          method: "GET",
        });
        const data = await res.json();
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
      <div className="h-screen w-screen bg-background pt-[75px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loginAs" element={<LoginAs />} />

          <Route path="/login/:role" element={<Login />} />

          <Route
            path="/signUpAsTransporter"
            element={<SignUpAsTransporter />}
          />
          <Route path="/signUpAsClient" element={<SignUpAsClient />} />
          <Route path="/signUpAs" element={<SignUpAs />} />
          <Route path="/client/post-a-bid" element={<PostABid />} />
          <Route path="/transporter/bids" element={<TransporterBids />} />
          <Route path="/client/bids" element={<ClientBids />} />
          <Route
            path="/transporter/:bidNo/post-a-quote"
            element={<PostAQuote />}
          />
          <Route path="/client/:bidId/see-quotes" element={<SeeQuotes />} />
          <Route
            path="/transporter/:bidId/upload-details"
            element={<UploadDetails />}
          />
          <Route path="/client/:bidId/details" element={<Details />} />
          <Route path="/client/:bidNo/journey" element={<JourneyTracking />} />
          <Route
            path="/client/manage-trusted-transporters"
            element={<ManageTrustedTransporters />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
