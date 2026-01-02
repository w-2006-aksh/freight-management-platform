import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiCall from "../util/apiCall";

export const ClientBidContext = createContext();
export const getClientBidContext = () => useContext(ClientBidContext);

export const ClientBidContextProvider = ({ children }) => {
  const [liveBids, setLiveBids] = useState([]);
  const [inProgressBids, setInProgressBids] = useState([]);
  const [deliveredBids, setDeliveredBids] = useState([]);
  const [expiredBids, setExpiredBids] = useState([]);

  const userSlice = useSelector((state) => state.user);

  const fetchLiveBids = async () => {
    const res = await apiCall("/api/client/live-bids");
    if (res.success) setLiveBids(res.liveBids || []);
  };

  const fetchInProgressBids = async () => {
    const res = await apiCall("/api/client/in-progress-bids");
    if (res.success) setInProgressBids(res.inProgressBids || []);
  };

  const fetchDeliveredBids = async () => {
    const res = await apiCall("/api/client/delivered-bids");
    if (res.success) setDeliveredBids(res.deliveredBids || []);
  };

  const fetchExpiredBids = async () => {
    const res = await apiCall("/api/client/expired-bids");
    if (res.success) setExpiredBids(res.expiredBids || []);
  };

  useEffect(() => {
    if (userSlice.isAuthenticated && userSlice.user?.role === "client") {
      fetchLiveBids();
      fetchInProgressBids();
      fetchDeliveredBids();
      fetchExpiredBids();
    }
  }, [userSlice.isAuthenticated, userSlice.user?._id]);

  const value = {
    liveBids,
    inProgressBids,
    deliveredBids,
    expiredBids,
    fetchLiveBids,
    fetchInProgressBids,
    fetchDeliveredBids,
  };

  return (
    <ClientBidContext.Provider value={value}>
      {children}
    </ClientBidContext.Provider>
  );
};
