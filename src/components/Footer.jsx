import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-10">

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* HRMS Info */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-3">
            HRMS System
          </h2>
          <p className="text-sm text-gray-400">
            HRMS helps organizations manage employees, attendance,
            payroll, and leave management efficiently using modern
            technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h2>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" className="hover:text-white transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">
            Contact
          </h2>

          <p className="text-sm text-gray-400">
            Email: hrms@gmail.com
          </p>

          <p className="text-sm text-gray-400">
            Phone: +91 9876543210
          </p>

          <p className="text-sm text-gray-400">
            Location: India
          </p>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © 2026 HRMS System | All Rights Reserved
      </div>

    </footer>
  );
}
