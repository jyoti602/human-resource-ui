import { Link } from "react-router-dom";

export default function MobileMenu({ isOpen, onClose, userRole = "guest" }) {
  if (!isOpen) return null;

  const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/employees", label: "Employees", icon: "👥" },
    { path: "/admin/attendance", label: "Attendance", icon: "📅" },
    { path: "/admin/leaves", label: "Leaves", icon: "🏖️" },
    { path: "/admin/payroll", label: "Payroll", icon: "💰" },
    { path: "/admin/reports", label: "Reports", icon: "📈" },
  ];

  const employeeLinks = [
    { path: "/employee/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/employee/attendance", label: "Attendance", icon: "📅" },
    { path: "/employee/applyleave", label: "Apply Leave", icon: "📝" },
    { path: "/employee/salary", label: "Salary", icon: "💵" },
    { path: "/employee/profile", label: "Profile", icon: "👤" },
  ];

  const publicLinks = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/about", label: "About", icon: "ℹ️" },
    { path: "/features", label: "Features", icon: "✨" },
    { path: "/contact", label: "Contact", icon: "📧" },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Mobile Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            {/* Public Links */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                General
              </h3>
              <nav className="space-y-1">
                {publicLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <span className="mr-3 text-lg">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Role-specific Links */}
            {(userRole === "admin" || userRole === "employee") && (
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {userRole === "admin" ? "Admin" : "Employee"} Portal
                </h3>
                <nav className="space-y-1">
                  {(userRole === "admin" ? adminLinks : employeeLinks).map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={onClose}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      <span className="mr-3 text-lg">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* Auth Links */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Account
              </h3>
              <nav className="space-y-1">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block w-full px-3 py-2 text-center text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="block w-full px-3 py-2 text-center text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors mt-2"
                >
                  Register
                </Link>
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2024 HRMS System. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
