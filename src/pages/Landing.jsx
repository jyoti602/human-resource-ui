import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import heroImage from "../assets/image.png";
import heroImage1 from "../assets/image1.jpeg";
import heroImage2 from "../assets/image2.png";
import heroImage3 from "../assets/image3.png";
import heroImage4 from "../assets/image4.png";

export default function Landing() {
  const heroImages = [heroImage, heroImage1, heroImage2, heroImage3, heroImage4];
  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroImages.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="bg-gray-50">
      <Topbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white py-20 text-center text-black sm:py-24 lg:py-32">
        <div className="absolute inset-0" aria-hidden="true">
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === activeHero ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-white/45" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold leading-tight text-blue-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Human Resource <br /> Management System
          </h2>

          <p className="mx-auto mb-8 mt-4 max-w-2xl text-sm text-blue-900 sm:text-base md:text-lg lg:text-xl">
            Manage employees, payroll, attendance and performance - all in one
            secure and powerful platform built for modern teams.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              to="/register-company"
              className="w-full rounded-full bg-white px-8 py-3 font-semibold text-indigo-600 shadow-lg transition hover:scale-105 sm:w-auto"
            >
              Start Free Setup
            </Link>

            <Link
              to="/features"
              className="w-full rounded-full border border-white px-8 py-3 font-semibold transition hover:bg-white hover:text-indigo-600 sm:w-auto"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES PREVIEW SECTION */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto mb-12 max-w-6xl px-4 text-center sm:px-6 sm:mb-16">
          <h3 className="mb-4 text-3xl font-bold text-gray-800 sm:text-4xl">
            Powerful HR Features
          </h3>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-base">
            Everything you need to manage your workforce efficiently.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-xl sm:p-8">
            <div className="mb-4 text-4xl sm:mb-6 sm:text-5xl">👥</div>
            <h4 className="mb-3 text-lg font-semibold sm:text-xl">Employee Management</h4>
            <p className="text-sm text-gray-600">
              Manage employee records, roles and departments securely.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-xl sm:p-8">
            <div className="mb-4 text-4xl sm:mb-6 sm:text-5xl">🕒</div>
            <h4 className="mb-3 text-lg font-semibold sm:text-xl">Attendance Tracking</h4>
            <p className="text-sm text-gray-600">
              Monitor attendance and working hours easily.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-xl sm:p-8">
            <div className="mb-4 text-4xl sm:mb-6 sm:text-5xl">💰</div>
            <h4 className="mb-3 text-lg font-semibold sm:text-xl">Payroll Automation</h4>
            <p className="text-sm text-gray-600">
              Automated salary calculation and payslip generation.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-xl sm:p-8">
            <div className="mb-4 text-4xl sm:mb-6 sm:text-5xl">📊</div>
            <h4 className="mb-3 text-lg font-semibold sm:text-xl">Reports & Analytics</h4>
            <p className="text-sm text-gray-600">
              Detailed performance and payroll insights.
            </p>
          </div>
        </div>

        {/* FEATURES PAGE BUTTON */}
        <div className="mt-10 text-center sm:mt-14">
          <Link
            to="/features"
            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-800 px-8 py-3 font-semibold text-white transition hover:bg-emerald-900 sm:w-auto"
          >
            View All Features
          </Link>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-slate-900 via-[#13352b] to-emerald-900 py-16 text-center text-white sm:py-20 lg:py-24">
        <h3 className="mb-6 overflow-hidden px-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
          <span className="slide-right-to-left inline-block whitespace-normal sm:whitespace-nowrap">
            Ready to transform your HR operations?
          </span>
        </h3>

        <Link
          to="/register-company"
          className="inline-flex w-[90%] max-w-xs items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-emerald-800 shadow-lg transition hover:scale-105 sm:w-auto sm:max-w-none sm:px-10"
        >
          Register Your Company
        </Link>
      </section>

      <Footer />
    </div>
  );
}
