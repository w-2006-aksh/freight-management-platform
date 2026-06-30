import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { getTransporterBidContext } from "../../../Context/TransporterContext.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";

function PostAQuote() {
  const { bidNo } = useParams();
  const navigate = useNavigate();

  const [bid, setBid] = useState(null);
  const [quotedPrice, setQuotedPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fetchLiveBids, fetchMyBids } = getTransporterBidContext();

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        const res = await apiCall(`/api/transporter/get-bid-details/${bidNo}`);

        if (res.success) {
          setBid(res.bid);
        } else {
          navigate("/transporter/bids");
        }
      } catch (error) {
        toast.error("Failed to load bid details");
        navigate("/transporter/bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBidDetails();
  }, [bidNo, navigate]);

  if (loading || !bid) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!quotedPrice || Number(quotedPrice) <= 0) return;

    setIsSubmitting(true);

    try {
      const res = await apiCall(`/api/transporter/${bidNo}/post-a-quote`, {
        method: "POST",
        body: { quotedPrice },
      });

      if (res.success) {
        await fetchLiveBids();
        await fetchMyBids();

        toast.success("Quote sent successfully!");
        navigate("/transporter/bids");
      } else {
        toast.error(res.message);
        navigate("/transporter/bids");
        await fetchLiveBids();

        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Internal server error. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6 pt-6">
          <div className="font-semibold">Bidding ID: {bid.bidNo}</div>

          <div className="flex justify-between px-4">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">From</div>
              <div className="font-semibold">{bid.from}</div>
              <div className="text-muted-foreground text-sm">
                {new Date(bid.startDate).toLocaleDateString()}
              </div>
            </div>

            <Truck className="text-muted-foreground size-5 self-center" />

            <div className="text-center">
              <div className="text-muted-foreground text-sm">To</div>
              <div className="font-semibold">{bid.to}</div>
              <div className="text-muted-foreground text-sm">
                {new Date(bid.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="text-muted-foreground text-right text-sm">
            Total Load:{" "}
            <span className="text-foreground font-semibold">{bid.load}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quotedPrice">
                Quote Total Price (for entire shipment)
              </Label>

              <Input
                type="number"
                id="quotedPrice"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !quotedPrice || Number(quotedPrice) <= 0}
              className="w-full"
            >
              {isSubmitting ? "Posting..." : "Post Quote"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostAQuote;
