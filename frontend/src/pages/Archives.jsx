import React, { useState, useEffect } from "react";
// Navbar and Footer removed for dashboard integration
import { useAuth } from "../context/AuthContext";

const Archives = () => {
  const { token, role } = useAuth();
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // navigate removed as back button is removed

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch("/api/fir/archives", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setArchives(data);
        } else {
          setError("Failed to fetch archives");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchArchives();
  }, [token]);

  return (
    <div className="flex flex-col h-full">
      {/* Container class removed to fit in dashboard area */}
      <div className="">
        <h1 className="text-2xl font-bold font-serif text-gray-800 mb-6">
          Case Archives
        </h1>

        {loading ? (
          <div className="text-center py-10">Loading archives...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600">{error}</div>
        ) : archives.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No archived cases found.
          </div>
        ) : (
          <div className="grid gap-6">
            {archives.map((fir) => (
              <div
                key={fir._id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full mb-2">
                      {fir.status.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-800">
                      FIR ID: {fir._id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted:{" "}
                      {new Date(fir.submission_date).toLocaleString()}
                    </p>
                  </div>
                  {role === "police" && (
                    <div className="text-right">
                      <span className="text-xs font-mono text-gray-400">
                        User ID: {fir.user_id}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700">Complaint:</h4>
                  <p className="text-gray-600 mt-1">{fir.original_text}</p>
                </div>

                {fir.applicable_sections &&
                  fir.applicable_sections.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">
                        Applied Sections:
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {fir.applicable_sections.map((section, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {fir.police_notes && (
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                    <h4 className="font-semibold text-gray-700 text-sm">
                      Police Notes:
                    </h4>
                    <p className="text-gray-600 text-sm italic mt-1">
                      {fir.police_notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Archives;
