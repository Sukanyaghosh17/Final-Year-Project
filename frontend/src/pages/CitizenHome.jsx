import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FileText, Search, Shield, Info } from "lucide-react";

const CitizenHome = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 select-none">
      <Navbar />

      {/* Official Header */}
      <header className="bg-white border-b border-gray-200 py-12 px-4 shadow-sm">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-violet-900 mb-4">
              Citizen Services Portal
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Efficient, transparent, and accessible public grievance redressal
              system.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/citizen/login"
              className="px-6 py-3 bg-violet-800 text-white font-bold rounded hover:bg-violet-900 transition shadow-sm"
            >
              Login
            </Link>
            <Link
              to="/citizen/signup"
              className="px-6 py-3 bg-white border border-violet-800 text-violet-800 font-bold rounded hover:bg-gray-50 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-violet-600 pl-4">
            Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard
              icon={<FileText className="w-8 h-8 text-violet-700" />}
              title="File Online FIR"
              description="Register a First Information Report for non-heinous crimes securely online."
            />
            <ServiceCard
              icon={<Search className="w-8 h-8 text-violet-700" />}
              title="Track Application"
              description="Check the current status of your filed complaints or service requests."
            />
            <ServiceCard
              icon={<Info className="w-8 h-8 text-violet-700" />}
              title="Information Center"
              description="Guidelines, FAQs, and safety protocols for citizens."
            />
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-white border-t border-gray-200 py-8 px-4 mt-auto">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-500">
            For Emergency Assistance, Dial <strong>112</strong>
          </p>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 border border-gray-200 rounded hover:border-violet-500 hover:shadow-md transition cursor-default">
    <div className="mb-4 bg-gray-50 inline-block p-3 rounded-full border border-gray-100">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default CitizenHome;
