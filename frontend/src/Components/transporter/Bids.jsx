import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import socket from "../../Socket.jsx";
import { getTransporterBidContext } from "../../../Context/TransporterContext.jsx";

function Bids() {
  const [activeTab, setActiveTab] = useState("live");

  const { liveBids, myBids } = getTransporterBidContext();

  const Navigate = useNavigate();

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
              ? " border-b-2 border-orange-600 font-semibold text-orange-600"
              : ""
          }`}
        >
          Live Bids
        </button>
        <button
          onClick={() => handleTabChange("myBids")}
          className={`hover:text-orange-600 ${
            activeTab === "myBids"
              ? "border-b-2 border-orange-600 font-semibold text-orange-600"
              : ""
          }`}
        >
          My Bids
        </button>
      </div>

      <div className="flex flex-col w-full items-center gap-y-4">
        {activeTab === "live" &&
          liveBids.map((bid) => (
            <div
              key={bid._id}
              className="flex flex-col gap-y-3 bg-white pb-8 rounded-[16px] hover:scale-[1.04] transition-all shadow-md max-w-[700px] w-full px-4 sm:px-10"
            >
              <div className="self-start font-semibold px-3 mt-4 sm:text-[16px] text-[15px]">
                Bidding ID : {bid.bidNo}
              </div>
              <div className="flex justify-between px-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center text-[15px] sm:text-[16px]">
                    From
                  </div>
                  <div className="font-semibold text-[15px] sm:text-[16px]">
                    {bid.from}
                  </div>
                  <div className="text-gray-500 text-[15px] sm:text-[16px]">
                    {new Date(bid.startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-truck-fast text-lg"></i>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[15px] sm:text-[16px]">To</div>
                  <div className="font-semibold text-[15px] sm:text-[16px]">
                    {bid.to}
                  </div>
                  <div className="text-gray-500 text-[15px] sm:text-[16px]">
                    {new Date(bid.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="pt-2 pr-4">
                <div className="text-right font-semibold italic text-gray-600 text-[13px] sm:text-sm">
                  Total Load:{" "}
                  <span className="not-italic text-black">
                    {bid.load.toLocaleString()} tons
                  </span>
                </div>
              </div>
              <button
                className="mt-2 font-semibold bg-orange-500 px-2 text-[15px] hover:scale-[1.05] py-1.5 rounded-md hover:bg-orange-400 max-w-[200px] self-end"
                onClick={() => {
                  Navigate(`/transporter/${bid.bidNo}/postAQuote`);
                }}
              >
                Quote a Price
              </button>
            </div>
          ))}

        {activeTab === "myBids" &&
          myBids.map((bid) => (
            <div
              key={bid._id}
              className="flex flex-col gap-y-3 bg-white pb-8 rounded-[16px] hover:scale-[1.04] transition-all shadow-md max-w-[700px] w-full px-4 sm:px-10"
            >
              <div className="self-start font-semibold px-3 mt-4 sm:text-[16px] text-[15px]">
                Bidding ID : {bid.bidNo}
              </div>
              <div className="flex justify-between px-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center text-[15px] sm:text-[16px]">
                    From
                  </div>
                  <div className="font-semibold text-[15px] sm:text-[16px]">
                    {bid.from}
                  </div>
                </div>
                <div className="flex items-center">
                  <i className="fa-solid fa-truck-fast text-lg"></i>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[15px] sm:text-[16px]">To</div>
                  <div className="font-semibold text-[15px] sm:text-[16px]">
                    {bid.to}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1 self-end pt-2 pr-4 text-right">
                <div className="font-semibold text-[13px] sm:text-[16px]">
                  Status:{" "}
                  <span className="italic text-blue-600">{bid.status}</span>
                </div>
                <div className="text-gray-600 text-[13px] sm:text-[16px]">
                  Your Quote: ₹{bid.finalPrice?.toLocaleString() || "N/A"}
                </div>
                <div className="text-gray-600 text-[13px] sm:text-[16px]">
                  Load: {bid.load} tons
                </div>
                {bid.status === "Awaiting transport details" && (
                  <Link
                    to={`/transporter/${bid._id}/uploadDetails`}
                    className=" self-end text-center px-3 font-semibold bg-orange-500 text-white py-1 rounded-lg text-[14px] hover:bg-orange-600 transition hover:scale-[1.03] shadow-md mt-2 w-fit hover:cursor-pointer"
                  >
                    {" "}
                    Upload details{" "}
                  </Link>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Bids;
