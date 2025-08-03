import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";

function PostAQuote() {
  const { bidNo } = useParams();
  const [quotedPrice, setQuotedPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [bid, setBid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBid = async () => {
      try {
        const res = await apiCall(`/api/bids/getBidDetails/${bidNo}`);
        if (res.success) {
          setBid(res.bid);
        } else {
          navigate("/transporter/bids");
        }
      } catch (error) {
        toast.error("Internal server error. Please try again later");
        navigate("/transporter/bids");
      } finally {
        setLoading(false);
      }
    };
    fetchBid();
  }, [bidNo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiCall(`/api/transporter/${bidNo}/postAQuote`, {
        method: "POST",
        body: { quotedPrice },
      });
      if (res.success) {
        toast.success("Quote sent successfully!");
        navigate("/transporter/bids");
      } else {
      }
    } catch (error) {
      toast.error("Internal server error. Please try again later.");
    }
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="font-sans flex justify-center items-center h-full">
      <div className="flex flex-col gap-y-6 bg-white py-5 px-2 sm:px-12 rounded-xl transition-all shadow-md max-w-[500px] w-full">
        <div className="self-start font-semibold px-1 pt-3 sm:text-[18px] text-[15px] ">
          Bidding ID: {bid.bidNo}
        </div>

        <div className="flex px-10 justify-between">
          <div className="flex flex-col justify-center items-center">
            <div className="sm:text-[18px] text-[15px] text-center">From</div>
            <div className="sm:text-[18px] text-[15px] font-semibold">
              {bid.from}
            </div>
            <div className="sm:text-[18px] text-[15px] text-gray-500 whitespace-nowrap">
              {new Date(bid.startDate).toLocaleDateString()}
            </div>
          </div>
          <div className="flex items-center">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="sm:text-[18px] text-[15px]">To</div>
            <div className="sm:text-[18px] text-[15px] font-semibold">
              {bid.to}
            </div>
            <div className="sm:text-[18px] text-[15px] text-gray-500 whitespace-nowrap">
              {new Date(bid.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="pr-4 pt-2">
          <div className="sm:text-sm text-[13px] text-gray-600 font-semibold italic">
            Total Load:{" "}
            <span className="text-black not-italic">{bid.load}</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[500px] max-w-full mx-auto gap-y-2 bg-white px-10 py-10 rounded-xl text-[18px] lg:text-[18px]"
        >
          <div className="flex flex-col gap-1 text-[15px] sm:text-[18px]">
            <label htmlFor="quotedPrice">Quote a Price</label>
            <input
              type="text"
              name="quotedPrice"
              id="quotedPrice"
              placeholder=""
              className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`font-semibold hover:scale-[1.02] transition text-white p-2 text-[15px] sm:text-[18px] lg:text-[18px] mt-4 rounded-md ${
              quotedPrice === "" || Number(quotedPrice) <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-400"
            }`}
            disabled={quotedPrice === "" || Number(quotedPrice) <= 0}
          >
            Post Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostAQuote;
