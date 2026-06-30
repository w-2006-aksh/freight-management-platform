import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function ManageTrustedTransporters() {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxTrustedTransporters = 10;

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        const res = await apiCall("/api/client/get-all-transporters");
        setTransporters(res.transporters);
      } catch (err) {
        toast.error("Failed to load transporters");
      } finally {
        setLoading(false);
      }
    };

    fetchTransporters();
  }, []);

  const toggleTrusted = (id) => {
    setTransporters((prev) =>
      prev.map((transporter) =>
        transporter._id === id
          ? { ...transporter, isTrusted: !transporter.isTrusted }
          : transporter
      )
    );
  };

  const saveTrusted = async () => {
    const trustedIds = transporters
      .filter((transporter) => transporter.isTrusted)
      .map((transporter) => transporter._id);

    if (trustedIds.length > maxTrustedTransporters) {
      toast.error(
        `You can select at most ${maxTrustedTransporters} trusted transporters`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await apiCall("/api/client/trusted-transporters", {
        method: "PUT",
        body: { trustedTransporters: trustedIds },
      });

      toast.success("Trusted transporters updated successfully");
    } catch (err) {
      toast.error("Failed to save trusted transporters");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-muted-foreground flex min-h-[200px] items-center justify-center">
        Loading transporters...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Trusted Transporters</CardTitle>
          <p className="text-muted-foreground text-sm">
            Select up to{" "}
            <span className="text-foreground font-semibold">{maxTrustedTransporters}</span>{" "}
            transporters you trust.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="divide-y rounded-md border">
            {transporters.map((transporter) => (
              <div
                key={transporter._id}
                className="flex items-center gap-4 px-4 py-3"
              >
                <Checkbox
                  id={transporter._id}
                  checked={transporter.isTrusted}
                  onCheckedChange={() => toggleTrusted(transporter._id)}
                />

                <Label htmlFor={transporter._id} className="flex-1 cursor-pointer">
                  <div className="font-medium">{transporter.name}</div>
                  <div className="text-muted-foreground text-sm">
                    {transporter.phNo} · {transporter.email}
                  </div>
                </Label>

                {transporter.isTrusted && (
                  <Badge variant="secondary">Trusted</Badge>
                )}
              </div>
            ))}
          </div>

          <Button onClick={saveTrusted} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ManageTrustedTransporters;
