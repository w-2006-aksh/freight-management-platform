import React, { useState } from "react";
import LoginWithOTP from "./LoginWithOtp";
import LoginWithPassword from "./LoginWithPassword";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Login() {
  const { role } = useParams();
  const [loginMode, changeLoginMode] = useState("password");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-6 p-6">
      <div className="flex flex-row gap-4">
        <Button
          variant={loginMode === "password" ? "default" : "ghost"}
          onClick={() => changeLoginMode("password")}
        >
          Login with Password
        </Button>
        <Button
          variant={loginMode === "OTP" ? "default" : "ghost"}
          onClick={() => changeLoginMode("OTP")}
        >
          Login with OTP
        </Button>
      </div>
      <Separator className="max-w-md" />
      {loginMode == "password" && <LoginWithPassword role={role} />}
      {loginMode == "OTP" && <LoginWithOTP role={role} />}
    </div>
  );
}

export default Login;
