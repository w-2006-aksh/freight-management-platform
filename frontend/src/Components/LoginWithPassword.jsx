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
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginWithPassword;
