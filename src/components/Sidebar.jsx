import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  FiSettings, 
  FiUser, 
  FiUsers, 
  FiCalendar, 
  FiFileText, 
  FiDollarSign, 
  FiBarChart2, 
  FiEdit3, 
  FiHome 
} from "react-icons/fi";

export default function Sidebar({ role, isOpen, onClose }) {
  const [adminOpen, setAdminOpen] = useState(true);
  const [employeeOpen, setEmployeeOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FiBarChart2 },
    { path: "/admin/employees", label: "Employees", icon: FiUsers },
    { path: "/admin/attendance", label: "Attendance", icon: FiCalendar },
    { path: "/admin/leaves", label: "Leave Requests", icon: FiFileText },
    { path: "/admin/payroll", label: "Payroll", icon: FiDollarSign },
    { path: "/admin/reports", label: "Reports", icon: FiBarChart2 },
  ];

  const employeeMenuItems = [
    { path: "/employee/dashboard", label: "Dashboard", icon: FiBarChart2 },
    { path: "/employee/profile", label: "My Profile", icon: FiUser },
    { path: "/employee/attendance", label: "Attendance", icon: FiCalendar },
    { path: "/employee/applyleave", label: "Apply Leave", icon: FiEdit3 },
    { path: "/employee/salary", label: "Salary", icon: FiDollarSign },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-64 xl:w-72 
        bg-gradient-to-b from-blue-600 to-blue-800 
        text-white 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-full lg:h-auto
        flex flex-col
      `}>

        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-blue-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg lg:text-xl font-bold flex items-center">
              <FiSettings className="mr-2 text-xl" />
              {role === "admin" ? "Admin Panel" : "Employee Panel"}
            </h2>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">

          {/* Admin Menu */}
          {role === "admin" && (
            <div className="space-y-2">
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                className="w-full text-left font-semibold hover:bg-blue-700 p-3 rounded-lg transition-all duration-200 flex items-center justify-between group"
              >
                <span className="flex items-center">
                  <FiUser className="mr-2" />
                  Admin Menu
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${adminOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`space-y-1 transition-all duration-300 ${adminOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center p-3 rounded-lg transition-all duration-200
                        ${isActive(item.path) 
                          ? 'bg-blue-700 text-white shadow-md' 
                          : 'hover:bg-blue-700 text-blue-100 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="mr-3 text-lg" />
                      <span className="font-medium">{item.label}</span>
                      {isActive(item.path) && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Employee Menu */}
          {role === "employee" && (
            <div className="space-y-2">
              <button
                onClick={() => setEmployeeOpen(!employeeOpen)}
                className="w-full text-left font-semibold hover:bg-blue-700 p-3 rounded-lg transition-all duration-200 flex items-center justify-between group"
              >
                <span className="flex items-center">
                  <FiUser className="mr-2" />
                  Employee Menu
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${employeeOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`space-y-1 transition-all duration-300 ${employeeOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {employeeMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center p-3 rounded-lg transition-all duration-200
                        ${isActive(item.path) 
                          ? 'bg-blue-700 text-white shadow-md' 
                          : 'hover:bg-blue-700 text-blue-100 hover:text-white'
                        }
                      `}
                    >
                      <Icon className="mr-3 text-lg" />
                      <span className="font-medium">{item.label}</span>
                      {isActive(item.path) && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </nav>

        {/* Footer */}
        <div className="p-4 lg:p-6 border-t border-blue-500">
          <div className="text-xs lg:text-sm text-blue-200 text-center">
            
          </div>
        </div>

      </aside>
    </>
  );
}