import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import apiCall from "../../../util/apiCall";
import { getClientBidContext } from "../../../Context/ClientBidContext";
function Bids() {
  const [activeTab, setActiveTab] = useState("live");

  const Navigate = useNavigate();

  const { liveBids, inProgressBids, deliveredBids } = getClientBidContext();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-4 px-6 py-3 w-full justify-center items-center font-sans">
      <div className="flex flex-row gap-7 border-b border-black pt-3 pb-2 w-full justify-center max-w-[700px]">
        <button
          onClick={() => handleTabChange("live")}
          className={`hover:text-orange-600 ${
            activeTab === "live"
              ? "border-b-2 border-orange-600 font-semibold text-orange-600"
              : ""
          }`}
        >
          {" "}
          Live Bids{" "}
        </button>
        <button
          onClick={() => handleTabChange("inProgress")}
          className={`hover:text-orange-600 ${
            activeTab === "inProgress"
              ? "border-b-2 border-orange-600 font-semibold text-orange-600"
              : ""
          }`}
        >
          {" "}
          In Progress{" "}
        </button>
        <button
          onClick={() => handleTabChange("delivered")}
          className={`hover:text-orange-600 ${
            activeTab === "delivered"
              ? "border-b-2 border-orange-600 font-semibold text-orange-600"
              : ""
          }`}
        >
          {" "}
          Delivered{" "}
        </button>
      </div>

      <div className="flex flex-col w-full items-center gap-y-4">
        {activeTab === "live" &&
          liveBids.map((bid) => (
            <Link
              key={bid._id}
              className="flex flex-col gap-y-3 bg-white pb-8 rounded-[16px] hover:scale-[1.04] transition-all shadow-md max-w-[700px] w-full px-4 sm:px-10"
              to={`/client/${bid._id}/see-quotes`}
            >
              <div className="self-start font-semibold px-3 mt-4 sm:text-[16px] text-[15px]">
                Bidding ID : {bid.bidNo}
              </div>
              <div className="flex [450px]-px-20 px-10 justify-between">
                <div className="flex flex-col justify-center items-center">
                  <div className="sm:text-[16px] text-[15px] text-center">
                    From
                  </div>
                  <div className="sm:text-[16px] text-[15px] font-semibold">
                    {bid.from}
                  </div>
                  <div className="sm:text-[16px] text-[15px] text-gray-500">
                    {new Date(bid.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-truck-fast"></i>{" "}
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="sm:text-[16px] text-[15px]">To</div>
                  <div className="sm:text-[16px] text-[15px] font-semibold">
                    {bid.to}
                  </div>
                  <div className="sm:text-[16px] text-[15px] text-gray-500">
                    {new Date(bid.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="pr-4 pt-2">
                <div className="sm:text-sm text-[13px] text-gray-600 font-semibold italic text-right">
                  Total Load:{" "}
                  <span className="text-black not-italic">
                    {bid.load.toLocaleString()} tons
                  </span>
                </div>
              </div>
            </Link>
          ))}

        {activeTab === "delivered" &&
          deliveredBids.map((bid) => (
            <div
              key={bid._id}
              className="flex flex-col gap-y-3 bg-white pb-8 rounded-[16px] hover:scale-[1.04] transition-all shadow-md max-w-[700px] w-full px-4 sm:px-10"
            >
              <div className="self-start font-semibold px-3 mt-4 sm:text-[16px] text-[13px]">
                Bidding ID : {bid.bidNo}
              </div>
              <div className="flex [450px]-px-20 px-10 justify-between">
                <div className="flex flex-col justify-center items-center">
                  <div className="sm:text-[16px] text-[15px] text-center">
                    From
                  </div>
                  <div className="sm:text-[16px] text-[15px] font-semibold">
                    {bid.from}
                  </div>
                  <div className="sm:text-[16px] text-[15px] text-gray-500">
                    {new Date(bid.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-truck-fast"></i>{" "}
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="sm:text-[16px] text-[15px]">To</div>
                  <div className="sm:text-[16px] text-[15px] font-semibold">
                    {bid.to}
                  </div>
                  <div className="sm:text-[16px] text-[15px] text-gray-500">
                    {new Date(bid.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="self-end text-right pr-4 pt-2 flex flex-col gap-1">
                <div className="sm:text-[16px] text-[13px] font-semibold">
                  Final Amount: ₹{bid.finalPrice?.toLocaleString() || "N/A"}
                </div>
                <div className="sm:text-[16px] text-[13px] text-gray-600">
                  Total Load: {bid.load} ton
                </div>
                <div className="sm:text-[16px] text-[13px] text-gray-600">
                  {bid.selectedTransporter?.name || "N/A"}
                </div>
                <div className="sm:text-[16px] text-[13px] text-gray-600">
                  Email: {bid.selectedTransporter?.email || "N/A"}
                </div>
                <div className="sm:text-[16px] text-[13px] text-gray-600">
                  Phone: {bid.selectedTransporter?.phNo || "N/A"}
                </div>
              </div>
            </div>
          ))}

        {activeTab === "inProgress" &&
          inProgressBids.map((bid) => (
            <div
              key={bid._id}
              className="flex flex-col gap-y-3 bg-white pb-8 rounded-[16px] hover:scale-[1.04] transition-all shadow-md max-w-[700px] w-full px-4 sm:px-10"
            >
              <div className="self-start font-semibold px-3 mt-4 sm:text-[16px] text-[13px]">
                Bidding ID : {bid.bidNo}
              </div>
              <div className="flex [450px]-px-20 px-10 justify-between">
                <div className="flex flex-col justify-center items-center">
                  <div className="sm:text-[16px] text-[15px] text-center">
                    From
                  </div>
                  <div className="sm:text-[16px] text-[15px] font-semibold">
                    {bid.from}
                  </div>
                  <div className="sm:text-[16px] text-[15px] text-gray-500">
                    {new Date(bid.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-truck-fast"></i>{" "}
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="sm:text-[16px] text-[15px]">To</div>
                  <div className="sm:text-[16px] text-[15px] font-semibold">
                    {bid.to}
                  </div>
                  <div className="sm:text-[16px] text-[15px] text-gray-500">
                    {new Date(bid.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="self-end text-right pr-4 pt-2 flex flex-col gap-1">
                <div className="sm:text-[16px] text-[13px] font-semibold">
                  Final Amount: ₹{bid.finalPrice?.toLocaleString() || "N/A"}
                </div>
                <div className="sm:text-[16px] text-[13px] text-gray-600">
                  status:{" "}
                  <span className="text-blue-500 italic">{bid.status} </span>
                </div>
                <div className="sm:text-[16px] text-[13px] text-gray-600">
                  Total Load: {bid.load} ton
                </div>
                <div className="sm:text-[16px] text-[13px] text-gray-600">
                  {bid.selectedTransporter?.name || "N/A"}
                </div>
                <div className="sm:text-[16px] text-[13px] text-gray-600">
                  Email: {bid.selectedTransporter?.email || "N/A"}
                </div>
                <div className="sm:text-[16px] text-[13px] text-gray-600">
                  Phone: {bid.selectedTransporter?.phNo || "N/A"}
                </div>
              </div>
              {bid.status === "Awaiting Detail Confirmation" && (
                <Link
                  to={`/client/${bid._id}/Details`}
                  className="text-white self-end p-2 bg-blue-500 rounded-md hover:cursor-pointer hover:bg-blue-400 w-fit"
                >
                  Confirm transport details
                </Link>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Bids;
