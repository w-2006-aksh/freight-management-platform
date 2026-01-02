import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { getTransporterBidContext } from "../../../Context/TransporterContext.jsx";

function PostAQuote() {
  const { bidNo } = useParams();
  const navigate = useNavigate();

  const [bid, setBid] = useState(null);
  const [quotedPrice, setQuotedPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fetchLiveBids, fetchMyBids } = getTransporterBidContext();

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const res = await apiCall(`/api/transporter/get-bid-details/${bidNo}`);

        if (res.success) {
          setBid(res.bid);
        } else {
          navigate("/transporter/bids");
        }
      } catch (error) {
        toast.error("Failed to load bid details");
        navigate("/transporter/bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBidDetails();
  }, [bidNo, navigate]);

  if (loading || !bid) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!quotedPrice || Number(quotedPrice) <= 0) return;

    setIsSubmitting(true);

    try {
      const res = await apiCall(`/api/transporter/${bidNo}/post-a-quote`, {
        method: "POST",
        body: { quotedPrice },
      });

      if (res.success) {
        await fetchLiveBids();
        await fetchMyBids();

        toast.success("Quote sent successfully!");
        navigate("/transporter/bids");
      } else {
        toast.error(res.message);
        navigate("/transporter/bids");
        await fetchLiveBids();

        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans flex justify-center items-center h-full">
      <div className="flex flex-col gap-y-6 bg-white py-5 px-2 sm:px-12 rounded-xl shadow-md max-w-[500px] w-full">
        <div className="font-semibold pt-3">Bidding ID: {bid.bidNo}</div>

        <div className="flex px-10 justify-between">
          <div className="text-center">
            <div>From</div>
            <div className="font-semibold">{bid.from}</div>
            <div className="text-gray-500">
              {new Date(bid.startDate).toLocaleDateString()}
            </div>
          </div>

          <i className="fa-solid fa-truck-fast self-center"></i>

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
          <span className="text-black font-semibold">{bid.load}</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-2 px-10 py-6"
        >
          <label htmlFor="quotedPrice">
            Quote Total Price (for entire shipment)
          </label>

          <input
            type="number"
            id="quotedPrice"
            value={quotedPrice}
            onChange={(e) => setQuotedPrice(e.target.value)}
            className="border rounded px-2 py-1"
          />

          <button
            type="submit"
            disabled={isSubmitting || !quotedPrice || Number(quotedPrice) <= 0}
            className={`mt-4 p-2 rounded-md text-white font-semibold transition
              ${
                isSubmitting || !quotedPrice || Number(quotedPrice) <= 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-400"
              }
            `}
          >
            {isSubmitting ? "Posting..." : "Post Quote"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostAQuote;
