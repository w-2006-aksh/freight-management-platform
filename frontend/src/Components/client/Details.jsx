import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiCall from "../../../util/apiCall";
import { toast } from "react-toastify";
import { getClientBidContext } from "../../../Context/ClientBidContext";

function Details() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [bidData, setBidData] = useState(null);
  const { fetchLiveBids, fetchInProgressBids } = getClientBidContext();

  const handleConfirmation = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await apiCall(`/api/client/${bidId}/confirm-details`, {
        method: "POST",
      });

      if (res.success) {
        await fetchLiveBids();
        await fetchInProgressBids();
        toast.success("Successful!");
        navigate("/client/bids");
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error");
      setIsSubmitting(false);
      navigate("/client/bids");
    }
  };

  useEffect(() => {
    const fetchBid = async () => {
      try {
        const res = await apiCall(`/api/client/${bidId}/details`);
        if (res.success) {
          setBidData(res.bid);
        } else {
          navigate("/client/bids");
        }
      } catch (error) {
        toast.error("Internal server error");
        navigate("/client/bids");
      } finally {
        setLoading(false);
      }
    };
    fetchBid();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="font-sans flex flex-col items-center gap-6 px-4 sm:px-12 py-6 min-h-screen">
      <div className="flex flex-col gap-y-6 bg-white py-5 px-4 sm:px-12 rounded-xl shadow-md max-w-[700px] w-full">
        <div className="font-semibold pt-3 sm:text-[18px] text-[15px]">
          Bidding ID: {bidData.bidNo}
        </div>

        <div className="flex justify-between px-6">
          <div className="flex flex-col items-center">
            <div>From</div>
            <div className="font-semibold">{bidData.from}</div>
            <div>{new Date(bidData.startDate).toLocaleDateString()}</div>
          </div>

          <i className="fa-solid fa-truck-fast text-lg self-center"></i>

          <div className="flex flex-col items-center">
            <div>To</div>
            <div className="font-semibold">{bidData.to}</div>
            <div>{new Date(bidData.endDate).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="font-semibold italic">
          Total Load: <span className="not-italic">{bidData.load}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center space-y-5 mt-4">
        <h1 className="text-2xl font-semibold">Transport Details</h1>

        <div className="bg-white w-full sm:w-[700px] p-4 rounded-md">
          <h1 className="font-semibold text-[18px]">Driver Details</h1>
          <div>Name: {bidData.transportDetails?.driverName || "N/A"}</div>
          <div>Phone: {bidData.transportDetails?.driverPhNo || "N/A"}</div>
          {bidData.transportDetails && (
            <div className="pt-2 text-orange-500 hover:underline">
              <a
                href={`http://localhost:8000/${bidData.transportDetails.driverLicenseUrl.replace(
                  /\\/g,
                  "/"
                )}`}
                target="_blank"
              >
                View driver license
              </a>
            </div>
          )}
        </div>

        <div className="bg-white w-full sm:w-[700px] p-4 rounded-md">
          <h1 className="font-semibold text-[18px]">Vehicle Details</h1>
          <div>Number: {bidData.transportDetails?.vehicleNo || "N/A"}</div>
          {bidData.transportDetails && (
            <div className="pt-2 text-orange-500 hover:underline">
              <a
                href={`http://localhost:8000/${bidData.transportDetails.vehicleDocumentUrl.replace(
                  /\\/g,
                  "/"
                )}`}
                target="_blank"
              >
                View Registration details
              </a>
            </div>
          )}
        </div>

        {bidData.status === "Awaiting Detail Confirmation" && (
          <button
            onClick={handleConfirmation}
            disabled={isSubmitting}
            className={`p-2 rounded-md border-2 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-400"
            }`}
          >
            {isSubmitting ? "Confirming..." : "Confirm"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Details;
