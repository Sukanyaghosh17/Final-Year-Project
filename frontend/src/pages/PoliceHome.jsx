import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Shield, Lock, Activity } from "lucide-react";

const PoliceHome = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      {/* Official Header */}
      <header className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 tracking-wide text-white">
            Official Police Portal
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 border-t border-gray-700 pt-6">
            Restricted Access. For Use by Authorized Law Enforcement Personnel
            Only.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/police/login"
              className="px-8 py-3 bg-violet-700 text-white font-bold rounded shadow-lg hover:bg-violet-600 transition"
            >
              Officer Login
            </Link>
          </div>
        </div>
      </header>

      {/* Info Panel */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl bg-white border border-gray-200 p-8 rounded shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <Lock className="w-6 h-6 text-red-700 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Security Compromise Warning
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Unauthorized attempts to access this system are monitored and
                will be prosecuted under the IT Act, 2000.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Activity className="w-6 h-6 text-green-700 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">System Status</h3>
              <p className="text-sm text-gray-600 mt-1">
                All systems operational. BNS Intelligence Module is active.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-auto py-6 text-center text-xs text-gray-400 bg-slate-900">
        Secure Connection | AES-256 Encryption
      </div>
    </div>
  );
};

export default PoliceHome;
