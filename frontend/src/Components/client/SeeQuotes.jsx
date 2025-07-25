import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";

function SeeQuotes() {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bidData, setBidData] = useState();
  const [allowSubmit, changeAllowSubmit] = useState(true);

  const handleAcceptQuote = async (quote) => {
    console.log("Sending quote:", JSON.stringify(quote, null, 2));
    changeAllowSubmit(false);
    // const res = await fetch(`/api/client/${bidId}/acceptQuote`, {
    //   method: "POST",
    //   credentials: "include",
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify(quote),
    // });
    // const data = await res.json();
    const res = await apiCall(`/api/client/${bidId}/acceptQuote`, {
      method: "POST",
      body: quote,
    });
    if (res.success) {
      toast.success("Request sent!");
      navigate("/client/bids");
    } else {
      changeAllowSubmit(true);
    }
  };

  useEffect(() => {
    const fetchBidandQuotes = async () => {
      try {
        // const res = await fetch(`/api/client/${bidId}/seeQuotes`, {
        //   credentials: "include",
        // });
        // const data = await res.json();
        const res = await apiCall(`/api/client/${bidId}/seeQuotes`, {
          // method: "GET",
        });
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
    fetchBidandQuotes();
  }, [bidId, navigate]);

  if (loading) return <div></div>;

  return (
    <div className="font-sans flex flex-col items-center gap-6 px-4 sm:px-12 py-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-y-6 bg-white py-5 px-4 sm:px-12 rounded-xl transition-all shadow-md max-w-[700px] w-full">
        <div className="font-semibold pt-3 sm:text-[18px] text-[15px]">
          Bidding ID: {bidData.bidDetails.bidNo}
        </div>

        <div className="flex justify-between px-6">
          <div className="flex flex-col items-center">
            <div className="text-[15px] sm:text-[16px]">From</div>
            <div className="font-semibold">{bidData.bidDetails.from}</div>
            <div className="text-gray-500">
              {new Date(bidData.bidDetails.startDate).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center">
            <i className="fa-solid fa-truck-fast text-lg"></i>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-[15px] sm:text-[16px]">To</div>
            <div className="font-semibold">{bidData.bidDetails.to}</div>
            <div className="text-gray-500">
              {new Date(bidData.bidDetails.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="text-gray-600 font-semibold italic">
          Total Load:{" "}
          <span className="text-black not-italic">
            {bidData.bidDetails.load}
          </span>
        </div>
      </div>

      {bidData.quotes.map((quote, index) => (
        <div
          key={index}
          className="transition-transform hover:scale-[1.03] bg-white shadow-md rounded-xl w-full max-w-[700px] p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-[16px] sm:text-[18px] font-semibold text-green-700">
              ₹{quote.quotedPrice}
            </div>

            <div className="flex flex-col sm:items-end text-[13px] sm:text-[15px] text-gray-700">
              <div className="font-medium">{quote.transporter.name}</div>
              <div>{quote.transporter.phNo}</div>
              <div>{quote.transporter.email}</div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              disabled={!allowSubmit}
              onClick={() => handleAcceptQuote(quote)}
              className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors 
            ${
              allowSubmit
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            >
              Accept and request details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SeeQuotes;
