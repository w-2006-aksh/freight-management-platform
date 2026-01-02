import { useContext, createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiCall from "../util/apiCall";

export const TransporterBidContext = createContext();
export const getTransporterBidContext = () => useContext(TransporterBidContext);

export const TransporterBidContextProvider = ({ children }) => {
  const [liveBids, setLiveBids] = useState([]);
  const [myBids, setMyBids] = useState([]);

  const userSlice = useSelector((state) => state.user);

  const fetchLiveBids = async () => {
    const res = await apiCall("/api/transporter/live-bids");
    if (res.success) setLiveBids(res.liveBids || []);
  };

  const fetchMyBids = async () => {
    const res = await apiCall("/api/transporter/my-bids");
    if (res.success) setMyBids(res.myBids || []);
  };

  useEffect(() => {
    if (!userSlice.isAuthenticated || userSlice.user?.role !== "transporter")
      return;

    fetchLiveBids();
    fetchMyBids();
  }, [userSlice.isAuthenticated, userSlice.user?._id]);

  const value = {
    liveBids,
    myBids,
    fetchLiveBids,
    fetchMyBids,
  };

  return (
    <TransporterBidContext.Provider value={value}>
      {children}
    </TransporterBidContext.Provider>
  );
};
