import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import axios from "axios";
import StationDropdown from "../../components/StationDropdown";

const PoliceSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    police_id: "",
    station_id: "",
  });
  const [stations, setStations] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axios.get("/api/auth/stations");
        setStations(res.data);
      } catch (e) {
        console.error("Failed to fetch stations");
      }
    };
    fetchStations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.station_id) {
      setError("Please select a Police Station");
      return;
    }

    try {
      await axios.post("/api/auth/register", {
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
        police_id: formData.police_id,
        station_id: formData.station_id,
        role: "police",
      });

      navigate("/police/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg p-8 bg-card rounded-lg shadow-xl border border-border">
          <h2 className="text-3xl font-bold text-center mb-6 text-foreground">
            Police Registration
          </h2>
          {error && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input rounded-md border border-border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input rounded-md border border-border"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Police ID
                </label>
                <input
                  type="text"
                  name="police_id"
                  value={formData.police_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input rounded-md border border-border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Station <span className="text-red-500">*</span>
                </label>
                <StationDropdown
                  stations={stations}
                  selected={formData.station_id}
                  onSelect={(id) =>
                    setFormData({ ...formData, station_id: id })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input rounded-md border border-border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-input rounded-md border border-border"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow hover:bg-primary/90 transition-colors"
            >
              Register
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already verified?{" "}
              <Link to="/police/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PoliceSignup;
