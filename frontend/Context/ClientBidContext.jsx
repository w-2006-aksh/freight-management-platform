import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiCall from "../util/apiCall";
import socket from "../src/Socket";

export const ClientBidContext = createContext();
export const getClientBidContext = () => useContext(ClientBidContext);

export const ClientBidContextProvider = ({ children }) => {
  const [liveBids, setLiveBids] = useState([]);
  const [inProgressBids, setInProgressBids] = useState([]);
  const [deliveredBids, setDeliveredBids] = useState([]);

  const userSlice = useSelector((state) => state.user);

  useEffect(() => {
    if (userSlice.isAuthenticated && userSlice.user?.role === "client") {
      apiCall("/api/client/live-bids").then((res) => {
        if (res.success) setLiveBids(res.liveBids || []);
      });
      apiCall("/api/client/in-progress-bids").then((res) => {
        if (res.success) setInProgressBids(res.inProgressBids || []);
      });

      apiCall("/api/client/delivered-bids").then((res) => {
        if (res.success) {
          setDeliveredBids(res.deliveredBids);
        }
      });

      const handleBidAccepted = (acceptedBid) => {
        console.log(acceptedBid);
        setLiveBids((prev) =>
          prev.filter((bid) => bid._id !== acceptedBid._id)
        );
        setInProgressBids((prev) => [acceptedBid, ...prev]);
      };

      const handleDetailsUploaded = (updatedBid) => {
        console.log("bid was updated! from io");
        setInProgressBids((prev) => {
          const others = prev.filter(
            (bid) => bid._id.toString() !== updatedBid._id.toString()
          );
          return [updatedBid, ...others];
        });
      };

      const handleNewBid = (newBid) => {
        setLiveBids((prev) => {
          const others = prev.filter(
            (bid) => bid._id.toString() !== newBid._id.toString()
          );
          return [newBid, ...others];
        });
      };

      socket.on("new-bid-posted", handleNewBid);
      socket.on("bid-accepted", handleBidAccepted);
      socket.on("details-uploaded", handleDetailsUploaded);

      return () => {
        socket.off("new-bid-posted", handleNewBid);

        socket.off("bid-accepted", handleBidAccepted);
        socket.off("details-uploaded", handleDetailsUploaded);
      };
    }
  }, [userSlice.isAuthenticated, userSlice.user]);

  const value = { liveBids, inProgressBids, deliveredBids };

  return (
    <ClientBidContext.Provider value={value}>
      {children}
    </ClientBidContext.Provider>
  );
};
