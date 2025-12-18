import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiCall from "../../../util/apiCall";
import { toast } from "react-toastify";

function Details() {
  const [loading, setLoading] = useState(true);
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [bidData, setBidData] = useState(null);

  const handleConfirmation = async () => {
    try {
      const res = await apiCall(`/api/client/${bidId}/confirm-details`, {
        method: "POST",
      });
      if (res.success === true) {
        toast.success("Successful!");
        navigate(`/client/bids`);
      } else {
      }
    } catch (error) {
      toast.error("Internal server error");
      navigate("/client/bids");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBid = async () => {
      try {
        const res = await apiCall(`/api/client/${bidId}/Details`);
        if (res.success) {
          setBidData(res.bid);
          setLoading(false);
        } else {
          navigate("/client/bids");
        }
      } catch (error) {
        toast.error("Internal server error");
        navigate("/client/bids");
      }
    };
    fetchBid();
  }, []);

  if (loading) {
    return <div></div>;
  }
  return (
    <div className="font-sans flex flex-col items-center gap-6 px-4 sm:px-12 py-6    min-h-screen">
      <div className="flex flex-col gap-y-6 bg-white py-5 px-4 sm:px-12 rounded-xl transition-all shadow-md max-w-[700px] w-full">
        <div className="font-semibold pt-3 sm:text-[18px] text-[15px]">
          Bidding ID: {bidData.bidNo}
        </div>

        <div className="flex justify-between px-6">
          <div className="flex flex-col items-center">
            <div className="text-[15px] sm:text-[16px]">From</div>
            <div className="font-semibold">{bidData.from}</div>
            <div className="  ">
              {new Date(bidData.startDate).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center">
            <i className="fa-solid fa-truck-fast text-lg"></i>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-[15px] sm:text-[16px]">To</div>
            <div className="font-semibold">{bidData.to}</div>
            <div className="  ">
              {new Date(bidData.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="   font-semibold italic">
          Total Load:{" "}
          <span className="text-black not-italic">{bidData.load}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center space-y-5    mt-4">
        <h1 className="text-2xl font-semibold">Transport Details</h1>
        <div className="bg-white w-full mx-auto sm:w-[700px] flex flex-col justify-center sm:p-4 p-3 rounded-md gap-y-1.5">
          <h1 className="font-semibold text-[18px]">Driver Details</h1>
          <div>
            <div>
              <span className=" ">Name:</span>{" "}
              {bidData.transportDetails?.driverName || "N/A"}
            </div>
            <div>
              <span className=" ">phone: </span>+91 {` `}{" "}
              {bidData.transportDetails?.driverPhNo || "N/A"}
            </div>

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
        </div>

        <div className="bg-white w-full mx-auto sm:w-[700px] flex flex-col justify-center sm:p-4 p-3 rounded-md gap-y-1.5">
          <h1 className="font-semibold text-[18px]">Vehicle Details</h1>
          <div>
            <div>
              <span className=" ">Number:</span>{" "}
              {bidData.transportDetails?.vehicleNo || "N/A"}
            </div>

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
        </div>
        {bidData.status === "Awaiting Detail Confirmation" && (
          <button
            onClick={handleConfirmation}
            className="bg-blue-500 p-2 rounded-md border-2 hover:bg-blue-400 hover:cursor-pointer"
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  );
}

export default Details;
