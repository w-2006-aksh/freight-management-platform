import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser, changeAuthenticationStatus } from "../redux/slices/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import apiCall from "../../util/apiCall";

function LoginWithOTP({ role }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [OTPSent, setOTPSent] = useState(false);

  const [loginData, setLoginData] = useState({
    phNo: "",
    OTP: "",
  });

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOTP = async () => {
    if (isSubmitting) return; 
    setIsSubmitting(true);

    try {
      const res = await apiCall(
        `/api/loginAndSignUp/${role}/login/request-OTP`,
        {
          method: "POST",
          body: { phNo: loginData.phNo },
        }
      );

      if (res.success) {
        setOTPSent(true);
        toast.success("OTP sent!");
      }
    } catch (error) {
      toast.error("Internal server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await apiCall(`/api/loginAndSignUp/${role}/login/OTP`, {
        method: "POST",
        body: {
          phNo: loginData.phNo,
          OTP: loginData.OTP,
        },
      });

      if (res.success) {
        dispatch(setUser(res.user));
        dispatch(changeAuthenticationStatus(true));

        toast.success(res.message);

        if (role === "client") navigate("/client/post-a-bid");
        else navigate("/transporter/bids");
      }
    } catch (error) {
      toast.error("Internal server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !OTPSent) {
      e.preventDefault();
      handleSendOTP();
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
            readOnly={OTPSent}
            onKeyDown={handleKeyPress}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none read-only:focus:ring-0 read-only:caret-transparent read-only:cursor-default read-only:bg-gray-100 focus:ring-2 focus:ring-orange-400 transition"
          />
        </div>

        {OTPSent && (
          <div className="flex flex-col">
            <label htmlFor="OTP" className="text-gray-700 text-lg mb-1">
              Authentication code
            </label>

            <input
              type="text"
              id="OTP"
              name="OTP"
              value={loginData.OTP}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />

            <div className="flex gap-x-2 mt-8">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSendOTP}
                className={`w-full py-2 rounded-lg text-lg font-medium text-white transition shadow-md
                  ${
                    isSubmitting
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 hover:scale-[1.03]"
                  }
                `}
              >
                Resend OTP
              </button>

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
            </div>
          </div>
        )}

        {!OTPSent && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSendOTP}
            className={`w-full py-2 rounded-lg text-lg font-medium text-white transition shadow-md
              ${
                isSubmitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 hover:scale-[1.03]"
              }
            `}
          >
            Send code
          </button>
        )}
      </form>
    </div>
  );
}

export default LoginWithOTP;
