import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { getClientBidContext } from "../../../Context/ClientBidContext";

function SeeQuotes() {
  const { bidId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bidData, setBidData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fetchLiveBids, fetchInProgressBids } = getClientBidContext();

  const handleAcceptQuote = async (quote) => {
    if (isSubmitting) return; 

    setIsSubmitting(true);

    try {
      const res = await apiCall(`/api/client/${bidId}/accept-quote`, {
        method: "POST",
        body: quote,
      });

      if (res.success) {
        await fetchLiveBids();
        await fetchInProgressBids();

        toast.success("Request sent!");
        navigate("/client/bids");
      } else {
        toast.error("Failed to accept quote");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error. Please try again later");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBidAndQuotes = async () => {
      try {
        const res = await apiCall(`/api/client/${bidId}/see-quotes`);
        if (res.success) {
          setBidData(res);
        } else {
          navigate("/client/bids");
        }
      } catch (error) {
        toast.error("Internal server error. Please try again later");
        navigate("/client/bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBidAndQuotes();
  }, [bidId, navigate]);

  if (loading || !bidData) return <div></div>;

  return (
    <div className="font-sans flex flex-col items-center gap-6 px-4 sm:px-12 py-6 bg-gray-100 min-h-screen">
      {/* Bid summary */}
      <div className="flex flex-col gap-y-6 bg-white py-5 px-4 sm:px-12 rounded-xl shadow-md max-w-[700px] w-full">
        <div className="font-semibold sm:text-[18px] text-[15px]">
          Bidding ID: {bidData.bidDetails.bidNo}
        </div>

        <div className="flex justify-between px-6">
          <div className="flex flex-col items-center">
            <div>From</div>
            <div className="font-semibold">{bidData.bidDetails.from}</div>
            <div className="text-gray-500">
              {new Date(bidData.bidDetails.startDate).toLocaleDateString()}
            </div>
          </div>

          <i className="fa-solid fa-truck-fast text-lg self-center"></i>

          <div className="flex flex-col items-center">
            <div>To</div>
            <div className="font-semibold">{bidData.bidDetails.to}</div>
            <div className="text-gray-500">
              {new Date(bidData.bidDetails.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="italic font-semibold text-gray-600">
          Total Load:{" "}
          <span className="text-black not-italic">
            {bidData.bidDetails.load}
          </span>
        </div>
      </div>

      {/* Quotes */}
      {bidData.quotes.map((quote) => (
        <div
          key={quote._id}
          className="bg-white shadow-md rounded-xl w-full max-w-[700px] p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-[18px] font-semibold text-green-700">
              ₹{quote.quotedPrice}
            </div>

            <div className="flex flex-col sm:items-end text-sm text-gray-700">
              <div className="font-medium">{quote.transporter.name}</div>
              <div>{quote.transporter.phNo}</div>
              <div>{quote.transporter.email}</div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              disabled={isSubmitting}
              onClick={() => handleAcceptQuote(quote)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors
                ${
                  isSubmitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }
              `}
            >
              {isSubmitting ? "Processing..." : "Accept and request details"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SeeQuotes;
