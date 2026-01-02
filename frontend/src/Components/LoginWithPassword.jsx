import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser, changeAuthenticationStatus } from "../redux/slices/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import apiCall from "../../util/apiCall";

function LoginWithPassword({ role }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({
    phNo: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; 
    setIsSubmitting(true);

    try {
      const res = await apiCall(`/api/loginAndSignUp/${role}/login/password`, {
        method: "POST",
        body: {
          phNo: loginData.phNo,
          password: loginData.password,
        },
      });

      if (res.success) {
        dispatch(setUser(res.user));
        dispatch(changeAuthenticationStatus(true));

        toast.success(res.message);

        if (role === "client") navigate("/client/post-a-bid");
        else navigate("/transporter/bids");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Internal server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[800px] w-full flex flex-row items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-xl px-8 py-10 space-y-6"
      >
        <div className="flex flex-col">
          <label htmlFor="phNo" className="text-gray-700 text-lg mb-1">
            Phone number
          </label>
          <input
            type="tel"
            id="phNo"
            name="phNo"
            value={loginData.phNo}
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
            value={loginData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded-lg text-lg font-medium text-white transition shadow-md
            ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 hover:scale-[1.03]"
            }
          `}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginWithPassword;
