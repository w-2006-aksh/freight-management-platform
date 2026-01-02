import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiCall from "../../../util/apiCall";

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
      console.log(`/api/client/${bidNo}/journey`);
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
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading tracking details…
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Bid #{bidNo}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Status: <span className="font-medium">{status}</span>
        </p>
      </div>

      {/* Timeline */}
      {journey.length === 0 ? (
        <p className="text-gray-500">Tracking not available yet.</p>
      ) : (
        <div className="relative pl-6">
          {journey.map((point, index) => {
            const isLast = index === journey.length - 1;

            return (
              <div key={index} className="flex items-start gap-4">
                {/* Dot + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isLast ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                  {!isLast && <div className="w-px h-10 bg-gray-200 mt-1" />}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <div className="text-base font-medium">
                    {prettifyCity(point.city)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(point.at).toLocaleString([], {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {isLast && (
                    <div className="mt-2 inline-block text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                      {status === "In Transit"
                        ? `Current Location`
                        : `Delivered`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
