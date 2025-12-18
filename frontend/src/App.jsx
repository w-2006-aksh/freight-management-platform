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
import { useDispatch } from "react-redux";
import { changeAuthenticationStatus, setUser } from "./redux/slices/user.js";
import TransporterBids from "./Components/transporter/Bids.jsx";
import ClientBids from "./Components/client/Bids.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PostAQuote from "./Components/transporter/PostAQuote.jsx";
import SeeQuotes from "./Components/client/SeeQuotes.jsx";
import UploadDetails from "./Components/transporter/UploadTransportDetails.jsx";
import Details from "./Components/client/Details.jsx";
import socket from "./Socket.jsx";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import JourneyTracking from "./Components/client/JourneyTracking.jsx";

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

  useEffect(() => {
    const onConnect = () => {
      console.log("Socket connected with ID:", socket.id);
      if (userSlice.isAuthenticated) {
        socket.emit("join-user-room", userSlice.user._id);
        if (userSlice.user.role === "transporter") {
          socket.emit("join-transporters-room");
        }
      }
    };

    const handleNewBidToast = (bid) => {
      if (userSlice.isAuthenticated && userSlice.user?.role === "transporter") {
        toast.info(`A new bid is now live: bid ${bid.bidNo}`);
      }
    };

    socket.on("connect", onConnect);
    socket.on("new-bid-posted", handleNewBidToast);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("new-bid-posted", handleNewBidToast);
    };
  }, [userSlice.isAuthenticated, userSlice.user]);

  return (
    <>
      <Navbar></Navbar>
      <div className="pt-[75px] bg-gray-200 w-screen h-screen">
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
          <Route path="/client/:bidId/Details" element={<Details />} />
          <Route path="/client/:bidNo/journey" element={<JourneyTracking />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
