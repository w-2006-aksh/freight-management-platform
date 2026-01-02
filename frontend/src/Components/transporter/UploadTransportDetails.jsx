import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { getTransporterBidContext } from "../../../Context/TransporterContext.jsx";

function UploadDetails() {
  const navigate = useNavigate();
  const { bidId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [details, setDetails] = useState({
    driverName: "",
    driverPhNo: "",
    driverLicense: null,
    vehicleNo: "",
    vehicleDocument: null,
  });

  const { fetchMyBids } = getTransporterBidContext();

  const handleChange = (e) => {
    if (e.target.files) {
      setDetails((prev) => ({
        ...prev,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setDetails((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const {
      driverName,
      driverPhNo,
      vehicleNo,
      driverLicense,
      vehicleDocument,
    } = details;

    if (
      !driverName ||
      !driverPhNo ||
      !vehicleNo ||
      !driverLicense ||
      !vehicleDocument
    ) {
      toast.error("Fill out all fields!");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("driverName", driverName);
    formData.append("driverPhNo", driverPhNo);
    formData.append("driverLicense", driverLicense);
    formData.append("vehicleNo", vehicleNo);
    formData.append("vehicleDocument", vehicleDocument);

    try {
      const res = await apiCall(`/api/transporter/${bidId}/upload-details`, {
        method: "POST",
        body: formData,
      });

      if (res.success) {
        await fetchMyBids();
        toast.success(res.message);
        navigate("/transporter/bids");
      } else {
        toast.error(res.message || "Failed to upload details");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-300 font-sans">
      <div className="m-10 text-center text-5xl p-3 font-bold">
        Upload details
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[500px] max-w-full mx-auto mt-4 space-y-6 bg-white px-10 py-10 rounded-xl text-[18px] lg:text-xl"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="driverName">Driver's Name</label>
          <input
            type="text"
            name="driverName"
            id="driverName"
            value={details.driverName}
            onChange={handleChange}
            className="py-2 border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="driverPhNo">Driver's phone number</label>
          <input
            type="tel"
            name="driverPhNo"
            id="driverPhNo"
            value={details.driverPhNo}
            onChange={handleChange}
            className="py-2 border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="driverLicense">Upload driver's license</label>
          <input
            type="file"
            name="driverLicense"
            id="driverLicense"
            className="hidden"
            accept=".pdf"
            onChange={handleChange}
          />
          <label
            htmlFor="driverLicense"
            className="px-2 py-2 border-2 border-dashed border-orange-300 cursor-pointer flex gap-2 rounded-md hover:bg-gray-100 hover:border-orange-500 text-orange-500"
          >
            <i className="fa-solid fa-upload"></i>
            <span>
              {details.driverLicense
                ? details.driverLicense.name
                : "Upload driver's license"}
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="vehicleNo">Vehicle Number</label>
          <input
            type="text"
            name="vehicleNo"
            id="vehicleNo"
            value={details.vehicleNo}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="vehicleDocument">Upload vehicle document</label>
          <input
            type="file"
            name="vehicleDocument"
            id="vehicleDocument"
            className="hidden"
            accept=".pdf"
            onChange={handleChange}
          />
          <label
            htmlFor="vehicleDocument"
            className="px-2 py-2 border-2 border-dashed border-orange-300 cursor-pointer flex gap-2 rounded-md hover:bg-gray-100 hover:border-orange-500 text-orange-500"
          >
            <i className="fa-solid fa-upload"></i>
            <span>
              {details.vehicleDocument
                ? details.vehicleDocument.name
                : "Upload vehicle document"}
            </span>
          </label>
        </div>

        <div className="text-[15px] text-gray-500 italic">
          Upload format must be PDF
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`font-semibold transition text-white p-2 text-[18px] lg:text-xl mt-4 rounded-md
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-400 hover:scale-[1.02]"
            }
          `}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default UploadDetails;
