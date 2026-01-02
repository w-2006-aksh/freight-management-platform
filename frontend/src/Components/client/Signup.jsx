import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiCall from "../../../util/apiCall";

function SignUpAsClient() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phNo: "",
    address: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (isAuthenticated) {
      toast.error("Already logged in!");
      navigate("/");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiCall("/api/loginAndSignUp/client/signup", {
        method: "POST",
        body: userData,
      });

      if (res.success) {
        toast.success(res.message);
        navigate("/login");
      } else {
        toast.error(res.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-200 font-sans pt-10">
      <div className="m-10 text-center text-5xl p-3 font-bold">
        Signing up as{" "}
        <span className="text-orange-600 hover:text-orange-500">Client</span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[500px] max-w-full mx-auto mt-4 space-y-6 bg-white px-10 py-10 rounded-xl text-[18px] lg:text-xl"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Enterprise's Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={userData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email ID</label>
          <input
            type="email"
            name="email"
            id="email"
            value={userData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phNo">Phone Number</label>
          <input
            type="tel"
            name="phNo"
            id="phNo"
            value={userData.phNo}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            value={userData.address}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={userData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded pl-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
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
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default SignUpAsClient;
