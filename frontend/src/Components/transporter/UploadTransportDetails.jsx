import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { getTransporterBidContext } from "../../../Context/TransporterContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

function UploadDetails() {
  const navigate = useNavigate();
  const { bidId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [details, setDetails] = useState({
    driverName: "",
    driverPhNo: "",
    driverLicense: null,
    vehicleNo: "",
    vehicleDocument: null,
  });

  const { fetchMyBids } = getTransporterBidContext();

  const handleChange = (e) => {
    if (e.target.files) {
      setDetails((prev) => ({
        ...prev,
        [e.target.name]: e.target.files[0],
      }));
    } else {
      setDetails((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const {
      driverName,
      driverPhNo,
      vehicleNo,
      driverLicense,
      vehicleDocument,
    } = details;

    if (
      !driverName ||
      !driverPhNo ||
      !vehicleNo ||
      !driverLicense ||
      !vehicleDocument
    ) {
      toast.error("Fill out all fields!");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("driverName", driverName);
    formData.append("driverPhNo", driverPhNo);
    formData.append("driverLicense", driverLicense);
    formData.append("vehicleNo", vehicleNo);
    formData.append("vehicleDocument", vehicleDocument);

    try {
      const res = await apiCall(`/api/transporter/${bidId}/upload-details`, {
        method: "POST",
        body: formData,
      });

      if (res.success) {
        await fetchMyBids();
        toast.success(res.message);
        navigate("/transporter/bids");
      } else {
        toast.error(res.message || "Failed to upload details");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center p-6 pt-10">
      <div className="mb-8 text-center text-4xl font-bold">
        Upload details
      </div>

      <Card className="w-full max-w-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="driverName">Driver's Name</Label>
              <Input
                type="text"
                name="driverName"
                id="driverName"
                value={details.driverName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverPhNo">Driver's phone number</Label>
              <Input
                type="tel"
                name="driverPhNo"
                id="driverPhNo"
                value={details.driverPhNo}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverLicense">Upload driver's license</Label>
              <input
                type="file"
                name="driverLicense"
                id="driverLicense"
                className="hidden"
                accept=".pdf"
                onChange={handleChange}
              />
              <Label
                htmlFor="driverLicense"
                className="border-input text-primary hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2"
              >
                <Upload className="size-4" />
                <span>
                  {details.driverLicense
                    ? details.driverLicense.name
                    : "Upload driver's license"}
                </span>
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNo">Vehicle Number</Label>
              <Input
                type="text"
                name="vehicleNo"
                id="vehicleNo"
                value={details.vehicleNo}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleDocument">Upload vehicle document</Label>
              <input
                type="file"
                name="vehicleDocument"
                id="vehicleDocument"
                className="hidden"
                accept=".pdf"
                onChange={handleChange}
              />
              <Label
                htmlFor="vehicleDocument"
                className="border-input text-primary hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2"
              >
                <Upload className="size-4" />
                <span>
                  {details.vehicleDocument
                    ? details.vehicleDocument.name
                    : "Upload vehicle document"}
                </span>
              </Label>
            </div>

            <p className="text-muted-foreground text-sm italic">
              Upload format must be PDF
            </p>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default UploadDetails;
