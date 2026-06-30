import { useState } from "react";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function SignUpAsTransporter() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phNo: "",
    gstNo: "",
    address: "",
    password: "",
  });

  const navigate = useNavigate();
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

    setIsSubmitting(true);

    try {
      const res = await apiCall("/api/loginAndSignUp/transporter/signup", {
        method: "POST",
        body: userData,
      });

      if (res.success) {
        toast.success(res.message);
        navigate("/login/transporter");
      } else {
        toast.error(res.message || "Signup failed");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center p-6 pt-10">
      <div className="mb-8 text-center text-4xl font-bold">
        Signing up as{" "}
        <span className="text-primary">Transporter</span>
      </div>

      <Card className="w-full max-w-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Enterprise's Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={userData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={userData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phNo">Phone Number</Label>
              <Input
                type="tel"
                name="phNo"
                id="phNo"
                value={userData.phNo}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNo">GST Number</Label>
              <Input
                type="text"
                name="gstNo"
                id="gstNo"
                value={userData.gstNo}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                name="address"
                id="address"
                value={userData.address}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={userData.password}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUpAsTransporter;
