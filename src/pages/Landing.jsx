import { Link } from "react-router-dom";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="bg-gray-50">

      <Topbar />

      {/* HERO SECTION */}
      <section className="relative py-32 text-center overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white">

        <div className="relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Smart HR Management <br /> Made Simple
          </h2>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Manage employees, payroll, attendance and performance —
            all in one secure and powerful platform built for modern teams.
          </p>

          <div className="flex justify-center gap-6">
            <Link
              to="/register-company"
              className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
            >
              Start Free Setup
            </Link>

            <Link
              to="/features"
              className="border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Explore Features
            </Link>
          </div>
        </div>

      </section>


      {/* FEATURES PREVIEW SECTION */}
      <section className="py-28 bg-gray-50">

        <div className="max-w-6xl mx-auto px-6 text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 text-gray-800">
            Powerful HR Features
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your workforce efficiently.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition text-center">
            <div className="text-5xl mb-6">👥</div>
            <h4 className="text-xl font-semibold mb-3">Employee Management</h4>
            <p className="text-gray-600 text-sm">
              Manage employee records, roles and departments securely.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition text-center">
            <div className="text-5xl mb-6">🕒</div>
            <h4 className="text-xl font-semibold mb-3">Attendance Tracking</h4>
            <p className="text-gray-600 text-sm">
              Monitor attendance and working hours easily.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition text-center">
            <div className="text-5xl mb-6">💰</div>
            <h4 className="text-xl font-semibold mb-3">Payroll Automation</h4>
            <p className="text-gray-600 text-sm">
              Automated salary calculation and payslip generation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition text-center">
            <div className="text-5xl mb-6">📊</div>
            <h4 className="text-xl font-semibold mb-3">Reports & Analytics</h4>
            <p className="text-gray-600 text-sm">
              Detailed performance and payroll insights.
            </p>
          </div>

        </div>

        {/* FEATURES PAGE BUTTON */}
        <div className="text-center mt-14">
          <Link
            to="/features"
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition"
          >
            View All Features
          </Link>
        </div>

      </section>


      {/* CTA SECTION */}
      <section className="py-24 bg-indigo-600 text-white text-center">
        <h3 className="text-4xl font-bold mb-6">
          Ready to transform your HR operations?
        </h3>

        <Link
          to="/register-company"
          className="bg-white text-indigo-600 px-10 py-4 rounded-full font-semibold shadow-lg hover:scale-105 transition"
        >
          Register Your Company
        </Link>
      </section>

      <Footer />

    </div>
  );
}
