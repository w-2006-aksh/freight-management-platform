import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";

function uploadDetails() {
  const Navigate = useNavigate();
  const { bidId } = useParams();
  const [allowSubmit, changeAllowSubmit] = useState(true);
  const [details, setDetails] = useState({
    driverName: "",
    driverPhNo: "",
    driverLicense: null,
    vehicleNo: "",
    vehicleDocument: null,
  });

  const handleChange = async (e) => {
    if (e.target.files) {
      setDetails((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    } else {
      setDetails((prev) => ({
        ...prev,

        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    changeAllowSubmit(false);
    const formData = new FormData();
    if (
      details.driverName == "" ||
      details.driverPhNo == "" ||
      details.vehicleNo == "" ||
      details.driverLicense == null ||
      details.vehicleDocument == null
    ) {
      toast.error("Fill out all fields!");
      changeAllowSubmit(true);
      return;
    } else {
      formData.append("driverName", details.driverName);
      formData.append("driverPhNo", details.driverPhNo);
      formData.append("driverLicense", details.driverLicense);
      formData.append("vehicleNo", details.vehicleNo);
      formData.append("vehicleDocument", details.vehicleDocument);

      try {
        // const res = await fetch(`/api/transporter/${bidId}/uploadDetails`, {
        //   method: "POST",
        //   credentials: "include",
        //   body: formData,
        // });
        // const data = await res.json();
        const res = await apiCall(`/api/transporter/${bidId}/uploadDetails`, {
          method: "POST",
          body: formData,
        });
        console.log(res);
        if (res.success) {
          toast.success(res.message);
          Navigate("/transporter/bids");
        } else {
          changeAllowSubmit(true);
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Internal server error.");
        changeAllowSubmit(true);
      }
    }
  };

  return (
    <>
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
              placeholder=""
              onChange={handleChange}
              value={details.driverName}
              className="py-2 border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="driverPhNo">Driver's phone number</label>
            <input
              type="tel"
              name="driverPhNo"
              id="driverPhNo"
              onChange={handleChange}
              value={details.driverPhNo}
              className="py-2 border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className=" flex flex-col gap-1">
            <label htmlFor="driverLicense">Upload driver's license </label>
            <div className="relative w-full">
              <input
                type="file"
                name="driverLicense"
                id="driverLicense"
                placeholder=""
                onChange={handleChange}
                className="hidden"
                accept=".pdf"
              />
              <label
                htmlFor="driverLicense"
                className=" px-2 py-2 justify-center items-center border-2 border-dashed border-orange-300 cursor-pointer z-10 w-full flex gap-2 rounded-md hover:bg-gray-100 hover:border-orange-500 text-orange-500"
              >
                <i className="fa-solid fa-upload"></i>
                <span>
                  {details.driverLicense
                    ? details.driverLicense.name
                    : "Upload driver's license"}
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="vehicleNo">Vehicle Number</label>
            <input
              type="text"
              name="vehicleNo"
              id="vehicleNo"
              placeholder="Enter vehicle number"
              onChange={handleChange}
              value={details.vehicleNo}
              className="border border-gray-300 rounded pl-2 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className=" flex flex-col gap-1">
            <label htmlFor="vehicleDocument">Upload vehicle document </label>
            <div className="relative w-full">
              <input
                type="file"
                name="vehicleDocument"
                id="vehicleDocument"
                placeholder=""
                className="hidden"
                accept=".pdf"
                onChange={handleChange}
              />
              <label
                htmlFor="vehicleDocument"
                className=" px-2 py-2 justify-center items-center border-2 border-dashed border-orange-300 cursor-pointer z-10 w-full flex gap-2 rounded-md hover:bg-gray-100 hover:border-orange-500 text-orange-500"
              >
                <i className="fa-solid fa-upload"></i>
                <span>
                  {details.vehicleDocument
                    ? details.vehicleDocument.name
                    : "Upload vehicle's document"}
                </span>
              </label>
            </div>
          </div>

          <div className="text-[15px] text-gray-500 italic">
            Upload Format must be pdf
          </div>

          <button
            type="submit"
            disabled={!allowSubmit}
            className="bg-orange-500 font-semibold hover:scale-[1.02] hover:bg-orange-400 transition text-white p-2 text-[18px] lg:text-xl mt-4 rounded-md disabled:cursor-not-allowed disabled:bg-gray-200"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default uploadDetails;
