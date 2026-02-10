import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Archives from "./Archives";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  MapPin,
  FileText,
  Activity,
  X,
  Check,
  BrainCircuit,
  Archive,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PoliceDashboard = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [firs, setFirs] = useState([]);
  const [selectedFir, setSelectedFir] = useState(null);
  const navigate = useNavigate();
  const { token, role, user } = useAuth();
  const { username } = useParams();

  // Prediction State
  const [ward, setWard] = useState("");
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("1");
  const [prediction, setPrediction] = useState(null);
  const [predLoading, setPredLoading] = useState(false);

  // BNS Search State
  const [query, setQuery] = useState("");
  const [bnsResults, setBnsResults] = useState([]);
  const [bnsLoading, setBnsLoading] = useState(false);

  useEffect(() => {
    if (token && (role === "police" || role === "admin")) {
      if (activeTab === "inbox") fetchFirs();
    }
  }, [activeTab, token, role]);

  const fetchFirs = async () => {
    try {
      const res = await axios.get("/api/fir/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFirs(res.data);
      // Also potentially fetch user details if not in context, but context should have it now
    } catch (e) {
      console.error("Failed to fetch FIRs", e);
    }
  };

  const handlePredict = async () => {
    setPredLoading(true);
    try {
      const res = await axios.post(
        "/api/intelligence/predict_crime",
        { ward, year, month },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPrediction(res.data.prediction);
    } catch (e) {
      alert("Prediction failed");
    } finally {
      setPredLoading(false);
    }
  };

  const handleBnsSearch = async (manualQuery = null) => {
    const q = manualQuery || query;
    if (!q) return;
    setBnsLoading(true);
    try {
      const res = await axios.post(
        "/api/intelligence/predict_bns",
        { query: q },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (manualQuery) return res.data.results; // Return if called programmatically
      setBnsResults(res.data.results);
    } catch (e) {
      alert("Search failed");
    } finally {
      setBnsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
          {/* Profile Header */}
          <div className="p-6 border-b border-border bg-muted/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700">
                <User size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">
                  {user?.full_name || "Officer"}
                </p>
                <p className="text-xs text-muted-foreground text-violet-700 font-semibold">
                  {user?.station_name || "Station Info N/A"}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pl-1">
              @{user?.username}
            </p>
          </div>

          <nav className="space-y-2 p-4 flex-1 overflow-y-auto">
            <NavButton
              active={activeTab === "inbox"}
              onClick={() => setActiveTab("inbox")}
              icon={<FileText size={20} />}
              label="FIR Inbox"
            />
            <NavButton
              active={activeTab === "prediction"}
              onClick={() => setActiveTab("prediction")}
              icon={<Activity size={20} />}
              label="Crime Forecaster"
            />
            <NavButton
              active={activeTab === "bns"}
              onClick={() => setActiveTab("bns")}
              icon={<Search size={20} />}
              label="BNS Intelligence"
            />
            <NavButton
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
              icon={<MapPin size={20} />}
              label="Analytics"
            />
            <NavButton
              active={activeTab === "archives"}
              onClick={() => setActiveTab("archives")}
              icon={<Archive size={20} />}
              label="Archives"
            />
          </nav>

          {/* Profile Footer */}
          <div className="p-4 border-t border-border mt-auto">
            <button
              onClick={() => navigate("/police/profile")}
              className="w-full flex items-center p-3 rounded-md hover:bg-accent text-sm font-medium transition-colors"
            >
              <User size={20} className="mr-3" /> My Profile
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 overflow-auto relative">
          {activeTab === "inbox" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Pending Reports</h2>
              <div className="grid gap-4">
                {firs.length === 0 ? (
                  <p className="text-muted-foreground">No pending reports.</p>
                ) : (
                  firs.map((fir) => (
                    <div
                      key={fir._id}
                      onClick={() => setSelectedFir(fir)}
                      className="p-4 border rounded-lg bg-card shadow-sm hover:shadow-md cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-lg">
                          FIR #{fir._id.substring(0, 8)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs uppercase font-bold ${fir.status === "pending" ? "bg-yellow-100 text-yellow-800" : fir.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                        >
                          {fir.status.replace("_", " ")}
                        </span>
                      </div>
                      {fir.complainant_name && (
                        <p className="text-xs text-violet-700 font-semibold mb-1">
                          Filed by: {fir.complainant_name}
                        </p>
                      )}
                      <p className="text-sm text-foreground/80 mb-2 line-clamp-2">
                        {fir.original_text}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>📅 {fir.incident_date || "N/A"}</span>
                        <span>📍 {fir.location || "Unknown"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "prediction" && (
            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Crime Risk Forecaster</h2>
              <div className="bg-card p-6 rounded-lg shadow border">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="Ward"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="p-2 border rounded bg-input"
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="p-2 border rounded bg-input"
                  />
                  <input
                    type="number"
                    placeholder="Month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="p-2 border rounded bg-input"
                  />
                </div>
                <button
                  onClick={handlePredict}
                  disabled={predLoading}
                  className="w-full bg-primary text-primary-foreground py-2 rounded"
                >
                  {predLoading ? "Analyzing..." : "Predict Crime Count"}
                </button>
                {prediction !== null && (
                  <div className="mt-6 text-center">
                    <div className="text-5xl font-bold mb-2">{prediction}</div>
                    <p
                      className={
                        prediction > 5
                          ? "text-red-500 font-bold"
                          : "text-green-500 font-bold"
                      }
                    >
                      {prediction > 5 ? "High Risk Area" : "Low Risk Area"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "bns" && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Legal Section Finder</h2>
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe crime..."
                  className="flex-1 p-3 border rounded bg-input"
                />
                <button
                  onClick={() => handleBnsSearch()}
                  disabled={bnsLoading}
                  className="bg-primary text-primary-foreground px-6 rounded"
                >
                  Search
                </button>
              </div>
              <div className="space-y-4">
                {bnsResults.map((res, i) => (
                  <div key={i} className="p-4 border rounded bg-card">
                    <div className="flex justify-between">
                      <h3 className="font-bold text-primary">{res.section}</h3>
                      <span>{(100 - res.distance).toFixed(1)}% Match</span>
                    </div>
                    <p className="text-sm mt-1">{res.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: "Jan", v: 400 },
                    { name: "Feb", v: 300 },
                    { name: "Mar", v: 200 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === "archives" && <Archives />}
        </main>

        {selectedFir && (
          <FIRReviewModal
            fir={selectedFir}
            onClose={() => setSelectedFir(null)}
            onUpdate={() => {
              setSelectedFir(null);
              fetchFirs();
            }}
            handleBnsSearch={handleBnsSearch}
          />
        )}
      </div>
    </div>
  );
};

const FIRReviewModal = ({ fir, onClose, onUpdate, handleBnsSearch }) => {
  const [status, setStatus] = useState(fir.status);
  const [sections, setSections] = useState(fir.applicable_sections || []);
  const [notes, setNotes] = useState(fir.police_notes || "");
  const [suggestedSections, setSuggestedSections] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const { token } = useAuth();

  const runAIAnalysis = async () => {
    setLoadingAI(true);
    try {
      const results = await handleBnsSearch(
        fir.translated_text || fir.original_text,
      );
      if (results) setSuggestedSections(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const addSection = (sec) => {
    if (!sections.includes(sec)) setSections([...sections, sec]);
  };

  const removeSection = (sec) => {
    setSections(sections.filter((s) => s !== sec));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `/api/fir/${fir._id}/update`,
        {
          status,
          applicable_sections: sections,
          police_notes: notes,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onUpdate();
    } catch (e) {
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-background z-10">
          <h2 className="text-2xl font-bold">
            Review FIR #{fir._id.substring(0, 8)}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded text-sm">
              <h3 className="font-bold mb-2">
                Original Complaint ({fir.language})
              </h3>
              <p>{fir.original_text}</p>
            </div>
            {fir.language !== "en" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded text-sm border-l-4 border-blue-500">
                <h3 className="font-bold mb-2">Translated (English)</h3>
                <p>{fir.translated_text}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 border rounded">📅 {fir.incident_date}</div>
              <div className="p-3 border rounded">🕒 {fir.incident_time}</div>
              <div className="col-span-2 p-3 border rounded">
                📍 {fir.location}
              </div>
              <div className="col-span-2 p-3 border rounded bg-gray-50">
                <p className="font-bold text-xs text-gray-500 uppercase mb-1">
                  Complainant Details
                </p>
                <p>Name: {fir.complainant_name || "N/A"}</p>
                <p>Phone: {fir.complainant_phone || "N/A"}</p>
                <p>Aadhar: {fir.complainant_aadhar || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold">Applicable BNS Sections</label>
                <button
                  onClick={runAIAnalysis}
                  disabled={loadingAI}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200"
                >
                  <BrainCircuit size={14} />{" "}
                  {loadingAI ? "Analyzing..." : "Auto-Suggest"}
                </button>
              </div>

              {/* Selected Chips */}
              <div className="flex flex-wrap gap-2 mb-4 p-2 border rounded min-h-[40px] bg-input/50">
                {sections.map((s) => (
                  <span
                    key={s}
                    className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {s}{" "}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => removeSection(s)}
                    />
                  </span>
                ))}
              </div>

              {/* Suggestions */}
              {suggestedSections.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-muted-foreground">
                    AI Suggestions:
                  </p>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                    {suggestedSections.map((s, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-2 border rounded hover:bg-accent cursor-pointer"
                        onClick={() => addSection(s.section)}
                      >
                        <div className="text-xs">
                          <span className="font-bold">{s.section}</span> -{" "}
                          {s.description.substring(0, 50)}...
                        </div>
                        <div className="text-xs font-bold text-green-600">
                          {(100 - s.distance).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="font-bold block mb-2">Police Notes</label>
              <textarea
                className="w-full p-2 border rounded bg-input h-24"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Investigator's remarks..."
              />
            </div>

            <div>
              <label className="font-bold block mb-2">Status</label>
              <select
                className="w-full p-2 border rounded bg-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress (Accepted)</option>
                <option value="resolved">Resolved (Charges Filed)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-muted/20 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded hover:bg-accent"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <Check size={18} /> Update & Save
          </button>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center p-3 rounded-md transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
  >
    <span className="mr-3">{icon}</span> {label}
  </button>
);

export default PoliceDashboard;
