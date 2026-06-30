import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { getClientBidContext } from "../../../Context/ClientBidContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Truck } from "lucide-react";

function SeeQuotes() {
  const { bidId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bidData, setBidData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fetchLiveBids, fetchInProgressBids } = getClientBidContext();

  const handleAcceptQuote = async (quote) => {
    if (isSubmitting) return; 

    setIsSubmitting(true);

    try {
      const res = await apiCall(`/api/client/${bidId}/accept-quote`, {
        method: "POST",
        body: quote,
      });

      if (res.success) {
        await fetchLiveBids();
        await fetchInProgressBids();

        toast.success("Request sent!");
        navigate("/client/bids");
      } else {
        toast.error("Failed to accept quote");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error. Please try again later");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBidAndQuotes = async () => {
      try {
        const res = await apiCall(`/api/client/${bidId}/see-quotes`);
        if (res.success) {
          setBidData(res);
        } else {
          navigate("/client/bids");
        }
      } catch (error) {
        toast.error("Internal server error. Please try again later");
        navigate("/client/bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBidAndQuotes();
  }, [bidId, navigate]);

  if (loading || !bidData) return <div></div>;

  return (
    <div className="flex min-h-full flex-col items-center gap-6 px-4 py-6 sm:px-12">
      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-6 pt-6">
          <div className="font-semibold">
            Bidding ID: {bidData.bidDetails.bidNo}
          </div>

          <div className="flex justify-between px-4">
            <div className="flex flex-col items-center">
              <div className="text-muted-foreground text-sm">From</div>
              <div className="font-semibold">{bidData.bidDetails.from}</div>
              <div className="text-muted-foreground text-sm">
                {new Date(bidData.bidDetails.startDate).toLocaleDateString()}
              </div>
            </div>

            <Truck className="text-muted-foreground size-5 self-center" />

            <div className="flex flex-col items-center">
              <div className="text-muted-foreground text-sm">To</div>
              <div className="font-semibold">{bidData.bidDetails.to}</div>
              <div className="text-muted-foreground text-sm">
                {new Date(bidData.bidDetails.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="text-muted-foreground font-medium italic">
            Total Load:{" "}
            <span className="text-foreground not-italic">
              {bidData.bidDetails.load}
            </span>
          </div>
        </CardContent>
      </Card>

      {bidData.quotes.map((quote) => (
        <Card key={quote._id} className="w-full max-w-2xl">
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-lg font-semibold text-green-700">
                ₹{quote.quotedPrice}
              </div>

              <div className="text-muted-foreground flex flex-col text-sm sm:items-end">
                <div className="text-foreground font-medium">{quote.transporter.name}</div>
                <div>{quote.transporter.phNo}</div>
                <div>{quote.transporter.email}</div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <Button
              disabled={isSubmitting}
              onClick={() => handleAcceptQuote(quote)}
            >
              {isSubmitting ? "Processing..." : "Accept and request details"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default SeeQuotes;
