import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiCall from "../../../util/apiCall";
import { toast } from "react-toastify";
import { getClientBidContext } from "../../../Context/ClientBidContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

function Details() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [bidData, setBidData] = useState(null);
  const { fetchLiveBids, fetchInProgressBids } = getClientBidContext();

  const handleConfirmation = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await apiCall(`/api/client/${bidId}/confirm-details`, {
        method: "POST",
      });

      if (res.success) {
        await fetchLiveBids();
        await fetchInProgressBids();
        toast.success("Successful!");
        navigate("/client/bids");
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error");
      setIsSubmitting(false);
      navigate("/client/bids");
    }
  };

  useEffect(() => {
    const fetchBid = async () => {
      try {
        const res = await apiCall(`/api/client/${bidId}/details`);
        if (res.success) {
          setBidData(res.bid);
        } else {
          navigate("/client/bids");
        }
      } catch (error) {
        toast.error("Internal server error");
        navigate("/client/bids");
      } finally {
        setLoading(false);
      }
    };
    fetchBid();
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="flex min-h-full flex-col items-center gap-6 px-4 py-6 sm:px-12">
      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-6 pt-6">
          <div className="font-semibold">Bidding ID: {bidData.bidNo}</div>

          <div className="flex justify-between px-4">
            <div className="flex flex-col items-center">
              <div className="text-muted-foreground text-sm">From</div>
              <div className="font-semibold">{bidData.from}</div>
              <div className="text-muted-foreground text-sm">
                {new Date(bidData.startDate).toLocaleDateString()}
              </div>
            </div>

            <Truck className="text-muted-foreground size-5 self-center" />

            <div className="flex flex-col items-center">
              <div className="text-muted-foreground text-sm">To</div>
              <div className="font-semibold">{bidData.to}</div>
              <div className="text-muted-foreground text-sm">
                {new Date(bidData.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="font-medium italic">
            Total Load: <span className="not-italic">{bidData.load}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full max-w-2xl flex-col items-center space-y-5">
        <h1 className="text-2xl font-semibold">Transport Details</h1>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Driver Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div>Name: {bidData.transportDetails?.driverName || "N/A"}</div>
            <div>Phone: {bidData.transportDetails?.driverPhNo || "N/A"}</div>
            {bidData.transportDetails && (
              <div className="pt-2">
                <a
                  href={`http://localhost:8000/${bidData.transportDetails.driverLicenseUrl.replace(
                    /\\/g,
                    "/"
                  )}`}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  View driver license
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div>Number: {bidData.transportDetails?.vehicleNo || "N/A"}</div>
            {bidData.transportDetails && (
              <div className="pt-2">
                <a
                  href={`http://localhost:8000/${bidData.transportDetails.vehicleDocumentUrl.replace(
                    /\\/g,
                    "/"
                  )}`}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  View Registration details
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {bidData.status === "Awaiting Detail Confirmation" && (
          <Button onClick={handleConfirmation} disabled={isSubmitting}>
            {isSubmitting ? "Confirming..." : "Confirm"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default Details;
