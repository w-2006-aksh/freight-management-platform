import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";

function PostABid() {
  const [cityData, setCityData] = useState([]);
  const navigate = useNavigate();
  const [bidData, setBidData] = useState({
    from: "",
    to: "",
    load: 0,
    commodity: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    async function fetchCities() {
      const res = await fetch("/api/client/getCities", { method: "GET" });
      const data = await res.json();
      setCityData(data.data);
    }

    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalBidData = {
        ...bidData,
        load: Number(bidData.load),
      };

      const res = await apiCall("/api/client/postABid", {
        method: "POST",
        body: finalBidData,
      });

      // const res = await fetch("/api/client/postABid", {
      //   credentials: "include",
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(finalBidData),
      // });

      // const data = await res.json();
      if (res.success) {
        toast.success(res.message);
        navigate("/client/bids");
      } else {
        navigate("/client/postABid");
      }
    } catch (error) {
      toast.error("Internal server error! Please try agian later.");
      navigate("/client/postABid");
    }
  };

  const handleChange = (e) => {
    setBidData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen font-sans">
      <h1 className="text-4xl font-bold mb-10 text-center">Request a Quote</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[500px] max-w-full mx-auto mt-4 space-y-6 bg-white px-10 py-10 rounded-xl text-[18px] lg:text-xl"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="from">From</label>
          <select
            name="from"
            id="from"
            value={bidData.from}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select city</option>
            {cityData.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="to">To</label>
          <select
            name="to"
            id="to"
            value={bidData.to}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select city</option>
            {cityData.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="load">Load capacity</label>
          <input
            type="number"
            name="load"
            id="load"
            value={bidData.load}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="commodity">Commodity</label>
          <input
            type="text"
            name="commodity"
            id="commodity"
            value={bidData.commodity}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="startDate">Start date</label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={bidData.startDate}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="endDate">End date</label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={bidData.endDate}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-500 font-semibold hover:scale-[1.02] hover:bg-orange-400 transition text-white p-2 text-[18px] lg:text-xl mt-4 rounded-md"
        >
          Post Request
        </button>
      </form>
    </div>
  );
}

export default PostABid;
