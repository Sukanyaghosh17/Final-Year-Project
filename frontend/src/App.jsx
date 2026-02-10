import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CitizenHome from "./pages/CitizenHome";
import PoliceHome from "./pages/PoliceHome";
import CitizenPortal from "./pages/CitizenPortal";
import PoliceDashboard from "./pages/PoliceDashboard";
import CitizenLogin from "./pages/auth/CitizenLogin";
import CitizenSignup from "./pages/auth/CitizenSignup";
import PoliceLogin from "./pages/auth/PoliceLogin";
import PoliceSignup from "./pages/auth/PoliceSignup";
import Archives from "./pages/Archives";
import CitizenProfile from "./pages/CitizenProfile";
import PoliceProfile from "./pages/PoliceProfile";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased font-sans">
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/citizen" element={<CitizenHome />} />
          <Route path="/police" element={<PoliceHome />} />

          {/* Auth Routes */}
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/citizen/signup" element={<CitizenSignup />} />
          <Route path="/police/login" element={<PoliceLogin />} />
          <Route path="/police/signup" element={<PoliceSignup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["citizen"]} />}>
            <Route
              path="/dashboard/citizen/:username"
              element={<CitizenPortal />}
            />
            <Route path="/citizen/profile" element={<CitizenProfile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["police"]} />}>
            <Route
              path="/dashboard/police/:username"
              element={<PoliceDashboard />}
            />
            <Route path="/archives" element={<Archives />} />
            <Route path="/police/profile" element={<PoliceProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
