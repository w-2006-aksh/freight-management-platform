import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { getTransporterBidContext } from "../../../Context/TransporterContext.jsx";

function Bids() {
  const [activeTab, setActiveTab] = useState("live");

  const { liveBids, myBids, fetchLiveBids, fetchMyBids } =
    getTransporterBidContext();
  const navigate = useNavigate();

  const handleReject = async (bidId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this bid?"
    );
    if (!confirmed) return;

    try {
      const res = await apiCall(`/api/transporter/bid/${bidId}/reject`, {
        method: "POST",
      });

      if (res.success) {
        await fetchLiveBids();
        toast.success("Bid rejected");
      }
    } catch {
      toast.error("Failed to reject bid");
    }
  };

  return (
    <div className="flex flex-col gap-4 px-6 py-3 w-full items-center font-sans">
      <div className="flex gap-7 border-b border-black pt-3 pb-2 w-full justify-center max-w-[700px]">
        <button
          onClick={() => setActiveTab("live")}
          className={`hover:text-orange-600 ${
            activeTab === "live"
              ? "border-b-2 border-orange-600 font-semibold text-orange-600"
              : ""
          }`}
        >
          Live Bids
        </button>

        <button
          onClick={() => setActiveTab("myBids")}
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
        {activeTab === "live" && liveBids.length > 0 && (
          <div className="max-w-[700px] w-full text-sm text-gray-600 italic text-center">
            Showing up to 10 available bids. Quote or reject a bid to see more.
          </div>
        )}

        {activeTab === "live" && liveBids.length === 0 && (
          <div className="max-w-[700px] w-full text-center text-gray-500 py-10">
            <div className="text-lg font-semibold">No live bids available</div>
            <div className="text-sm mt-1">
              You'll see bids here when clients invite you to quote.
            </div>
          </div>
        )}

        {activeTab === "live" &&
          liveBids.map((invite) => {
            const bid = invite.bid;

            return (
              <div
                key={bid._id}
                className="flex flex-col gap-y-3 bg-white pb-6 rounded-2xl shadow-md max-w-[700px] w-full px-4 sm:px-10"
              >
                <div className="font-semibold mt-4">
                  Bidding ID : {bid.bidNo}
                </div>

                <div className="flex justify-between px-10">
                  <div className="text-center">
                    <div>From</div>
                    <div className="font-semibold">{bid.from}</div>
                    <div className="text-gray-500">
                      {new Date(bid.startDate).toLocaleDateString()}
                    </div>
                  </div>

                  <i className="fa-solid fa-truck-fast text-lg self-center"></i>

                  <div className="text-center">
                    <div>To</div>
                    <div className="font-semibold">{bid.to}</div>
                    <div className="text-gray-500">
                      {new Date(bid.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="text-right text-sm text-gray-600">
                  Total Load:{" "}
                  <span className="text-black font-semibold">
                    {bid.load.toLocaleString()} tons
                  </span>
                </div>

                <div className="flex gap-3 self-end">
                  <button
                    className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-1.5 rounded-md font-semibold"
                    onClick={() =>
                      navigate(`/transporter/${bid.bidNo}/post-a-quote`)
                    }
                  >
                    Quote
                  </button>

                  <button
                    className="bg-red-500 hover:bg-red-400 text-white px-3 py-1.5 rounded-md font-semibold"
                    onClick={() => handleReject(bid._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}

        {activeTab === "myBids" &&
          myBids.map((bid) => (
            <div
              key={bid._id}
              className="flex flex-col gap-y-3 bg-white pb-6 rounded-2xl shadow-md max-w-[700px] w-full px-4 sm:px-10"
            >
              <div className="font-semibold mt-4">Bidding ID : {bid.bidNo}</div>

              <div className="flex justify-between px-10">
                <div className="text-center">
                  <div>From</div>
                  <div className="font-semibold">{bid.from}</div>
                </div>

                <i className="fa-solid fa-truck-fast text-lg self-center"></i>

                <div className="text-center">
                  <div>To</div>
                  <div className="font-semibold">{bid.to}</div>
                </div>
              </div>

              <div className="text-right text-sm">
                <div>
                  Status:{" "}
                  <span className="italic text-blue-600">{bid.status}</span>
                </div>
                <div>
                  Your Quote: ₹{bid.finalPrice?.toLocaleString() || "N/A"}
                </div>
                <div>Load: {bid.load} tons</div>

                {bid.status === "Awaiting Transport Details" && (
                  <Link
                    to={`/transporter/${bid._id}/upload-details`}
                    className="inline-block mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg font-semibold"
                  >
                    Upload details
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
