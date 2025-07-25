import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser, changeAuthenticationStatus } from "../../redux/slices/user";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";

function LoginAsClient() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      toast.error("Already logged in!");
      navigate("/");
    }
    try {
      // const response = await fetch("/api/loginAndSignUp/client/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(userData),
      // });
      // const data = await response.json();

      const res = await apiCall("/api/loginAndSignUp/client/login", {
        method: "POST",
        body: userData,
      });

      if (res.success) {
        dispatch(setUser(res.user)), dispatch(changeAuthenticationStatus(true));
        toast.success(res.message);

        navigate("/client/postABid");
      } else {
      }
    } catch (error) {
      toast.error("Internal server error. Please try again later.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-200 font-sans">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
          Logging in as{" "}
          <span className="text-orange-600 hover:text-orange-500">Client</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-xl rounded-xl px-8 py-10 space-y-6"
        >
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 text-lg mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@abc.com"
              value={userData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 text-lg mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={userData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg text-lg font-medium hover:bg-orange-600 transition hover:scale-[1.03] shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default LoginAsClient;
