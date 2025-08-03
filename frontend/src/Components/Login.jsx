import React, { useState } from "react";
import LoginWithOtp from "./LoginWithOtp";
import LoginWithPassword from "./LoginWithPassword";
import { useParams } from "react-router-dom";

function Login() {
  const { role } = useParams();
  const [loginMode, changeLoginMode] = useState("password");

  return (
    <div className="flex flex-col items-center justify-center w-screen h-full space-y-3">
      <div className="flex flex-row gap-7 border-b border-black pt-3 pb-2  justify-center max-w-[600px] w-fit ">
        <button
          onClick={() => changeLoginMode("password")}
          className={`hover:text-orange-600 ${
            loginMode === "password"
              ? "border-b-2 border-orange-600 font-semibold text-orange-600"
              : ""
          }`}
        >
          {" "}
          Login with Password{" "}
        </button>
        <button
          onClick={() => changeLoginMode("OTP")}
          className={`hover:text-orange-600 ${
            loginMode === "OTP"
              ? "border-b-2 border-orange-600 font-semibold text-orange-600"
              : ""
          }`}
        >
          {" "}
          Login with OTP{" "}
        </button>
      </div>
      {loginMode == "password" && <LoginWithPassword role={role} />}
      {loginMode == "OTP" && <LoginWithOtp role={role} />}
    </div>
  );
}

export default Login;
