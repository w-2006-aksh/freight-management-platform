import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getClientBidContext } from "../../../Context/ClientBidContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";

function Bids() {
  const [activeTab, setActiveTab] = useState("live");

  const {
    liveBids,
    inProgressBids,
    deliveredBids,
    expiredBids,
    fetchDeliveredBids,
    fetchInProgressBids,
    fetchLiveBids,
  } = getClientBidContext();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchLiveBids();
    fetchInProgressBids();
    fetchDeliveredBids();
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-4 px-6 py-3">
      <div className="flex w-full max-w-2xl flex-row flex-wrap justify-center gap-2">
        <Button
          variant={activeTab === "live" ? "default" : "ghost"}
          onClick={() => handleTabChange("live")}
        >
          Live Bids
        </Button>

        <Button
          variant={activeTab === "inProgress" ? "default" : "ghost"}
          onClick={() => handleTabChange("inProgress")}
        >
          In Progress
        </Button>

        <Button
          variant={activeTab === "delivered" ? "default" : "ghost"}
          onClick={() => handleTabChange("delivered")}
        >
          Delivered
        </Button>

        <Button
          variant={activeTab === "expired" ? "default" : "ghost"}
          onClick={() => handleTabChange("expired")}
        >
          Expired
        </Button>
      </div>

      {activeTab === "live" && liveBids.length === 0 && (
        <Card className="w-full max-w-2xl">
          <CardContent className="py-10 text-center">
            <div className="text-lg font-semibold">No live bids</div>
            <div className="text-muted-foreground mt-1 text-sm">
              You will see your active bids here once created.
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "live" && liveBids.length > 0 && (
        <p className="text-muted-foreground w-full max-w-2xl text-center text-sm italic">
          Reminder: Bids must be finalized before the start date or they will
          expire automatically.
        </p>
      )}

      <div className="flex w-full flex-col items-center gap-y-4">
        {activeTab === "live" &&
          liveBids.map((bid) => (
            <Link
              key={bid._id}
              to={`/client/${bid._id}/see-quotes`}
              className="w-full max-w-2xl"
            >
              <Card className="transition-transform hover:scale-[1.02]">
                <CardContent className="space-y-4 pt-6">
                  <div className="font-semibold">Bidding ID : {bid.bidNo}</div>

                  <div className="flex justify-between px-4">
                    <div className="flex flex-col items-center">
                      <div className="text-muted-foreground text-sm">From</div>
                      <div className="font-semibold">{bid.from}</div>
                      <div className="text-muted-foreground text-sm">
                        {new Date(bid.startDate).toLocaleDateString()}
                      </div>
                    </div>

                    <Truck className="text-muted-foreground size-5 self-center" />

                    <div className="flex flex-col items-center">
                      <div className="text-muted-foreground text-sm">To</div>
                      <div className="font-semibold">{bid.to}</div>
                      <div className="text-muted-foreground text-sm">
                        {new Date(bid.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-muted-foreground text-right text-sm italic">
                    Total Load:{" "}
                    <span className="text-foreground not-italic font-medium">
                      {bid.load.toLocaleString()} tons
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

        {activeTab === "inProgress" && inProgressBids.length === 0 && (
          <Card className="w-full max-w-2xl">
            <CardContent className="py-10 text-center">
              <div className="text-lg font-semibold">No bids in progress</div>
              <div className="text-muted-foreground mt-1 text-sm">
                Bids appear here after a transporter is finalized.
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "inProgress" &&
          inProgressBids.map((bid) => (
            <Card key={bid._id} className="w-full max-w-2xl">
              <CardContent className="space-y-4 pt-6">
                <div className="font-semibold">Bidding ID : {bid.bidNo}</div>
                <div className="flex justify-between px-4">
                  <div className="flex flex-col items-center">
                    <div className="text-muted-foreground text-sm">From</div>
                    <div className="font-semibold">{bid.from}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(bid.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Truck className="text-muted-foreground size-5 self-center" />
                  <div className="flex flex-col items-center">
                    <div className="text-muted-foreground text-sm">To</div>
                    <div className="font-semibold">{bid.to}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(bid.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-right text-sm">
                  <div className="font-semibold">
                    Final Amount: ₹{bid.finalPrice?.toLocaleString() || "N/A"}
                  </div>
                  <div className="text-muted-foreground">
                    status:{" "}
                    <Badge variant="secondary">{bid.status}</Badge>
                  </div>
                  <div className="text-muted-foreground">
                    Total Load: {bid.load} ton
                  </div>
                  <div className="text-muted-foreground">
                    {bid.selectedTransporter?.name || "N/A"}
                  </div>
                  <div className="text-muted-foreground">
                    Email: {bid.selectedTransporter?.email || "N/A"}
                  </div>
                  <div className="text-muted-foreground">
                    Phone: {bid.selectedTransporter?.phNo || "N/A"}
                  </div>
                </div>
              </CardContent>
              {bid.status === "Awaiting Detail Confirmation" && (
                <CardFooter className="justify-end">
                  <Button asChild>
                    <Link to={`/client/${bid._id}/details`}>
                      Confirm transport details
                    </Link>
                  </Button>
                </CardFooter>
              )}
              {bid.status === "In Transit" && (
                <CardFooter className="justify-end">
                  <Button asChild>
                    <Link to={`/client/${bid.bidNo}/journey`}>
                      Track shipping
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}

        {activeTab === "delivered" && deliveredBids.length === 0 && (
          <Card className="w-full max-w-2xl">
            <CardContent className="py-10 text-center">
              <div className="text-lg font-semibold">No delivered bids yet</div>
              <div className="text-muted-foreground mt-1 text-sm">
                Completed shipments will appear here.
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "delivered" &&
          deliveredBids.map((bid) => (
            <Card key={bid._id} className="w-full max-w-2xl">
              <CardContent className="space-y-4 pt-6">
                <div className="font-semibold">Bidding ID : {bid.bidNo}</div>
                <div className="flex justify-between px-4">
                  <div className="flex flex-col items-center">
                    <div className="text-muted-foreground text-sm">From</div>
                    <div className="font-semibold">{bid.from}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(bid.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <Truck className="text-muted-foreground size-5 self-center" />
                  <div className="flex flex-col items-center">
                    <div className="text-muted-foreground text-sm">To</div>
                    <div className="font-semibold">{bid.to}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(bid.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-right text-sm">
                  <div className="font-semibold">
                    Final Amount: ₹{bid.finalPrice?.toLocaleString() || "N/A"}
                  </div>
                  <div className="text-muted-foreground">
                    Total Load: {bid.load} ton
                  </div>
                  <div className="text-muted-foreground">
                    {bid.selectedTransporter?.name || "N/A"}
                  </div>
                  <div className="text-muted-foreground">
                    Email: {bid.selectedTransporter?.email || "N/A"}
                  </div>
                  <div className="text-muted-foreground">
                    Phone: {bid.selectedTransporter?.phNo || "N/A"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        {activeTab === "expired" && expiredBids.length > 0 && (
          <p className="text-muted-foreground w-full max-w-2xl text-center text-sm italic">
            These bids expired because no transporter was finalized before the
            cutoff.
          </p>
        )}

        {activeTab === "expired" &&
          expiredBids.map((bid) => (
            <Card key={bid._id} className="w-full max-w-2xl opacity-80">
              <CardContent className="space-y-4 pt-6">
                <div className="font-semibold">Bidding ID : {bid.bidNo}</div>

                <div className="flex justify-between px-4">
                  <div className="flex flex-col items-center">
                    <div className="text-muted-foreground text-sm">From</div>
                    <div className="font-semibold">{bid.from}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(bid.startDate).toLocaleDateString()}
                    </div>
                  </div>

                  <Truck className="text-muted-foreground size-5 self-center" />

                  <div className="flex flex-col items-center">
                    <div className="text-muted-foreground text-sm">To</div>
                    <div className="font-semibold">{bid.to}</div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(bid.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default Bids;
