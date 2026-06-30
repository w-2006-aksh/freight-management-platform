import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { getTransporterBidContext } from "../../../Context/TransporterContext.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";

function Bids() {
  const [activeTab, setActiveTab] = useState("live");

  const { liveBids, myBids, fetchLiveBids, fetchMyBids } =
    getTransporterBidContext();
  const navigate = useNavigate();

  const handleReject = async (bidId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this bid?"
    );
    if (!confirmed) return;

    try {
      const res = await apiCall(`/api/transporter/bid/${bidId}/reject`, {
        method: "POST",
      });

      if (res.success) {
        await fetchLiveBids();
        toast.success("Bid rejected");
      }
    } catch {
      toast.error("Failed to reject bid");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 px-6 py-3">
      <div className="flex w-full max-w-2xl justify-center gap-2">
        <Button
          variant={activeTab === "live" ? "default" : "ghost"}
          onClick={() => setActiveTab("live")}
        >
          Live Bids
        </Button>

        <Button
          variant={activeTab === "myBids" ? "default" : "ghost"}
          onClick={() => setActiveTab("myBids")}
        >
          My Bids
        </Button>
      </div>

      <div className="flex w-full flex-col items-center gap-y-4">
        {activeTab === "live" && liveBids.length > 0 && (
          <p className="text-muted-foreground w-full max-w-2xl text-center text-sm italic">
            Showing up to 10 available bids. Quote or reject a bid to see more.
          </p>
        )}

        {activeTab === "live" && liveBids.length === 0 && (
          <Card className="w-full max-w-2xl">
            <CardContent className="py-10 text-center">
              <div className="text-lg font-semibold">No live bids available</div>
              <div className="text-muted-foreground mt-1 text-sm">
                You'll see bids here when clients invite you to quote.
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "live" &&
          liveBids.map((invite) => {
            const bid = invite.bid;

            return (
              <Card key={bid._id} className="w-full max-w-2xl">
                <CardContent className="space-y-4 pt-6">
                  <div className="font-semibold">Bidding ID : {bid.bidNo}</div>

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
                    <span className="text-foreground font-semibold">
                      {bid.load.toLocaleString()} tons
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="justify-end gap-3">
                  <Button
                    onClick={() =>
                      navigate(`/transporter/${bid.bidNo}/post-a-quote`)
                    }
                  >
                    Quote
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handleReject(bid._id)}
                  >
                    Reject
                  </Button>
                </CardFooter>
              </Card>
            );
          })}

        {activeTab === "myBids" &&
          myBids.map((bid) => (
            <Card key={bid._id} className="w-full max-w-2xl">
              <CardContent className="space-y-4 pt-6">
                <div className="font-semibold">Bidding ID : {bid.bidNo}</div>

                <div className="flex justify-between px-4">
                  <div className="text-center">
                    <div className="text-muted-foreground text-sm">From</div>
                    <div className="font-semibold">{bid.from}</div>
                  </div>

                  <Truck className="text-muted-foreground size-5 self-center" />

                  <div className="text-center">
                    <div className="text-muted-foreground text-sm">To</div>
                    <div className="font-semibold">{bid.to}</div>
                  </div>
                </div>

                <div className="space-y-1 text-right text-sm">
                  <div>
                    Status:{" "}
                    <Badge variant="secondary">{bid.status}</Badge>
                  </div>
                  <div>
                    Your Quote: ₹{bid.finalPrice?.toLocaleString() || "N/A"}
                  </div>
                  <div>Load: {bid.load} tons</div>
                </div>
              </CardContent>

              {bid.status === "Awaiting Transport Details" && (
                <CardFooter className="justify-end">
                  <Button asChild>
                    <Link to={`/transporter/${bid._id}/upload-details`}>
                      Upload details
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
      </div>
    </div>
  );
}

export default Bids;
