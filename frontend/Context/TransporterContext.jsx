import { useContext, createContext, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import apiCall from "../util/apiCall";
import socket from "../src/Socket";

export const TransporterBidContext = createContext();
export const getTransporterBidContext = () => useContext(TransporterBidContext);

export const TransporterBidContextProvider = ({ children }) => {
  const [liveBids, setLiveBids] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const userSlice = useSelector((state) => state.user);

  useEffect(() => {
    if (userSlice.isAuthenticated && userSlice.user?.role === "transporter") {
      apiCall("/api/transporter/live-bids").then((res) => {
        if (res.success) setLiveBids(res.liveBids || []);
      });
      apiCall("/api/transporter/my-bids").then((res) => {
        if (res.success) setMyBids(res.myBids || []);
      });

      const handleNewBid = (newBid) => {
        setLiveBids((prev) => {
          if (prev.some((bid) => bid._id === newBid._id)) return prev;
          return [newBid, ...prev];
        });
      };

      const handleBidWon = (wonBid) => {
        setLiveBids((prev) => prev.filter((bid) => bid._id !== wonBid._id));
        setMyBids((prev) => [wonBid, ...prev]);
      };

      const handleQuoteSubmitted = (data) => {
        const { bidNo } = data;
        setLiveBids((prev) =>
          prev.filter((bid) => bid.bidNo.toString() !== bidNo.toString())
        );
      };

      const handleDetailsUploaded = (updatedBid) => {
        setMyBids((prev) => {
          const others = prev.filter(
            (previousBid) => previousBid.bidNo != updatedBid.bidNo
          );
          return [updatedBid, ...others];
        });
      };

      socket.on("new-bid-posted", handleNewBid);
      socket.on("quote-submitted", handleQuoteSubmitted);
      socket.on("bid-won", handleBidWon);
      socket.on("details-uploaded", handleDetailsUploaded);

      return () => {
        socket.off("new-bid-posted", handleNewBid);
        socket.off("quote-submitted", handleQuoteSubmitted);
        socket.off("bid-won", handleBidWon);
        socket.off("details-uploaded", handleDetailsUploaded);
      };
    }
  }, [userSlice.isAuthenticated, userSlice.user]);

  return (
    <TransporterBidContext.Provider
      value={{ myBids, liveBids, setLiveBids, setMyBids }}
    >
      {children}
    </TransporterBidContext.Provider>
  );
};
