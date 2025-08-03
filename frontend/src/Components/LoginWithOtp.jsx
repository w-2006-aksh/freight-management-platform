import React, { use, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser, changeAuthenticationStatus } from "../redux/slices/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import apiCall from "../../util/apiCall";

function LoginWithOtp({ role }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [allowSubmit, changeAllowSubmit] = useState(true);
  const [otpSent, changeOtpSentStatus] = useState(false);
  const [loginData, changeLoginData] = useState({
    phNo: "",
    OTP: "",
  });

  const handleChange = (e) => {
    changeLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async (e) => {
    changeAllowSubmit(false);
    try {
      const res = await apiCall(
        `/api/loginAndSignUp/${role}/login/requestOTP`,
        {
          method: "POST",
          body: { phNo: loginData.phNo },
        }
      );
      if (res.success) {
        changeOtpSentStatus(true);
        toast.success("OTP sent!");
      } else {
      }
    } catch (error) {
      toast.error("Internal server error");
    } finally {
      changeAllowSubmit(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    changeAllowSubmit(false);
    try {
      const res = await apiCall(`/api/loginAndSignUp/${role}/login/otp`, {
        method: "POST",
        body: { phNo: loginData.phNo, OTP: loginData.OTP },
      });

      if (res.success) {
        dispatch(setUser(res.user)), dispatch(changeAuthenticationStatus(true));
        toast.success(res.message);
        if (role == "client") navigate("client/postABid");
        else navigate("/transporter/bids");
      } else {
      }
    } catch (error) {
      toast.error("Internal server error. Please try again later.");
    } finally {
      changeAllowSubmit(true);
    }
  };
  const handleKeyPress=(e)=>{
    if(e.key=='Enter'&&!otpSent){
      e.preventDefault();
      handleSendOtp();
    }
  }

  return (
    <div className="max-w-[800px] w-full flex flex-row items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-xl rounded-xl px-8 py-10 space-y-6"
      >
        <div className="flex flex-col">
          {" "}
          <label htmlFor="phNo" className="tex-gray-700 text-lg mb-1">
            Phone number
          </label>
          <input
            type="tel"
            id="phNo"
            readOnly={otpSent}
            onKeyDown={handleKeyPress}
            name="phNo"
            placeholder=""
            value={loginData.phNo}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none read-only:focus:ring-0 read-only:caret-transparent read-only:cursor-default read-only:bg-gray-100  focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        {otpSent && (
          <div className="flex flex-col">
            <label htmlFor="OTP" className="text-gray-700 text-lg mb-1">
              Authentication code
            </label>

            <input
              type="text"
              id="OTP"
              name="OTP"
              placeholder=""
              value={loginData.OTP}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />

            <div className="flex flex-row gap-x-2 mt-8">
              <button
                type="button"
                disabled={!allowSubmit}
                className="w-full bg-blue-500 hover:cursor-pointer text-white py-2 rounded-lg text-lg font-medium hover:bg-blue-600 transition hover:scale-[1.03] shadow-md disabled:bg-gray-300 cursor-none"
                onClick={handleSendOtp}
              >
                Resend OTP
              </button>

              <button
                type="submit"
                disabled={!allowSubmit}
                className="w-full bg-orange-500 hover:cursor-pointer text-white py-2 rounded-lg text-lg font-medium hover:bg-orange-600 transition hover:scale-[1.03] shadow-md disabled:bg-gray-300 cursor-none"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {!otpSent && (
          <button
            type="button"
            disabled={!allowSubmit}
            className="w-full bg-blue-500 hover:cursor-pointer text-white py-2 rounded-lg text-lg font-medium hover:bg-blue-600 transition hover:scale-[1.03] shadow-md disabled:bg-gray-300 cursor-none"
            onClick={handleSendOtp}
          >
            Send code
          </button>
        )}
      </form>
    </div>
  );
}

export default LoginWithOtp;
