import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { getClientBidContext } from "../../../Context/ClientBidContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PostABid() {
  const [cityData, setCityData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [bidData, setBidData] = useState({
    from: "",
    to: "",
    load: 0,
    commodity: "",
    startDate: "",
    endDate: "",
  });

  const { fetchLiveBids } = getClientBidContext();

  useEffect(() => {
    async function fetchCities() {
      const data = await apiCall("/api/client/getCities");
      setCityData(data.data);
    }

    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const finalBidData = {
        ...bidData,
        load: Number(bidData.load),
      };

      const res = await apiCall("/api/client/post-a-bid", {
        method: "POST",
        body: finalBidData,
      });

      if (res.success) {
        await fetchLiveBids();
        toast.success(res.message);
        navigate("/client/bids");
      } else {
        toast.error(res.message || "Failed to post bid");
        setIsSubmitting(false);
        navigate("/client/post-a-bid");
      }
    } catch (error) {
      toast.error("Internal server error! Please try again later.");
      setIsSubmitting(false);
      navigate("/client/post-a-bid");
    }
  };

  const handleChange = (e) => {
    setBidData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center p-6">
      <h1 className="mb-6 text-3xl font-bold">Request a Quote</h1>

      <p className="text-muted-foreground mb-6 max-w-lg text-center text-sm italic">
        Note: Bids automatically expire if a transporter is not finalized by the
        scheduled start date.
      </p>

      <Card className="w-full max-w-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="from">From</Label>
              <Select
                name="from"
                value={bidData.from || undefined}
                onValueChange={(value) =>
                  handleChange({ target: { name: "from", value } })
                }
              >
                <SelectTrigger id="from">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cityData.map((city, index) => (
                    <SelectItem key={index} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Select
                name="to"
                value={bidData.to || undefined}
                onValueChange={(value) =>
                  handleChange({ target: { name: "to", value } })
                }
              >
                <SelectTrigger id="to">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cityData.map((city, index) => (
                    <SelectItem key={index} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="load">Load capacity (tons)</Label>
              <Input
                type="number"
                name="load"
                id="load"
                value={bidData.load}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commodity">Commodity</Label>
              <Input
                type="text"
                name="commodity"
                id="commodity"
                value={bidData.commodity}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                type="date"
                name="startDate"
                id="startDate"
                value={bidData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input
                type="date"
                name="endDate"
                id="endDate"
                value={bidData.endDate}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Posting..." : "Post Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostABid;
