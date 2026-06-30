import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser, changeAuthenticationStatus } from "../redux/slices/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import apiCall from "../../util/apiCall";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="flex w-full max-w-md items-center justify-center">
      <Card className="w-full">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="phNo">Phone number</Label>
              <Input
                type="tel"
                id="phNo"
                name="phNo"
                value={loginData.phNo}
                readOnly={OTPSent}
                onKeyDown={handleKeyPress}
                onChange={handleChange}
                className={OTPSent ? "bg-muted" : ""}
              />
            </div>

            {OTPSent && (
              <div className="space-y-2">
                <Label htmlFor="OTP">Authentication code</Label>

                <Input
                  type="text"
                  id="OTP"
                  name="OTP"
                  value={loginData.OTP}
                  onChange={handleChange}
                />

                <div className="mt-8 flex gap-2">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSendOTP}
                    variant="secondary"
                    className="w-full"
                  >
                    Resend OTP
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Login
                  </Button>
                </div>
              </div>
            )}

            {!OTPSent && (
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleSendOTP}
                variant="secondary"
                className="w-full"
              >
                Send code
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginWithOTP;
