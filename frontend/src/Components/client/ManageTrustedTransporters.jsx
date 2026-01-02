import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiCall from "../../../util/apiCall";

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
      <div className="flex justify-center items-center min-h-[200px] text-gray-600">
        Loading transporters...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-2">
        Manage Trusted Transporters
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        Select up to{" "}
        <span className="font-semibold">{maxTrustedTransporters}</span>{" "}
        transporters you trust.
      </p>

      <div className="divide-y border rounded-md">
        {transporters.map((transporter) => (
          <div
            key={transporter._id}
            className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={transporter.isTrusted}
              onChange={() => toggleTrusted(transporter._id)}
              className="h-4 w-4 accent-green-600 cursor-pointer"
            />

            <div className="flex-1">
              <div className="font-medium text-gray-800">
                {transporter.name}
              </div>
              <div className="text-sm text-gray-500">
                {transporter.phNo} · {transporter.email}
              </div>
            </div>

            {transporter.isTrusted && (
              <span className="text-xs text-green-600 font-medium">
                Trusted
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={saveTrusted}
        disabled={isSubmitting}
        className={`mt-6 px-6 py-2 rounded-md text-white font-medium
          ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }
        `}
      >
        {isSubmitting ? "isSubmitting..." : "Save"}
      </button>
    </div>
  );
}

export default ManageTrustedTransporters;
