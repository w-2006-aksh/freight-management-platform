import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiCall from "../../../util/apiCall";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function prettifyCity(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
}
export default function JourneyTracking() {
  const { bidNo } = useParams();
  const [journey, setJourney] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJourney() {
      const data = await apiCall(`/api/client/${bidNo}/journey`);

      if (data.success) {
        setJourney(data.journey || []);
        setStatus(data.status);
      }

      setLoading(false);
    }

    fetchJourney();
  }, [bidNo]);

  if (loading) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center">
        Loading tracking details…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Bid #{bidNo}</CardTitle>
          <p className="text-muted-foreground text-sm">
            Status: <span className="text-foreground font-medium">{status}</span>
          </p>
        </CardHeader>
      </Card>

      {journey.length === 0 ? (
        <p className="text-muted-foreground">Tracking not available yet.</p>
      ) : (
        <Card>
          <CardContent className="relative pl-6 pt-6">
            {journey.map((point, index) => {
              const isLast = index === journey.length - 1;

              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`size-3 rounded-full ${
                        isLast ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                    {!isLast && <div className="bg-border mt-1 h-10 w-px" />}
                  </div>

                  <div className="pb-8">
                    <div className="text-base font-medium">
                      {prettifyCity(point.city)}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {new Date(point.at).toLocaleString([], {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    {isLast && (
                      <Badge variant="secondary" className="mt-2">
                        {status === "In Transit"
                          ? `Current Location`
                          : `Delivered`}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
