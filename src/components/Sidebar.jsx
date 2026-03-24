import { Link, useLocation } from "react-router-dom";
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
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ role, isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const companyLabel = getCompanyLabel(user);

  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FiBarChart2 },
    { path: "/admin/employees", label: "Employees", icon: FiUsers },
    { path: "/admin/attendance", label: "Attendance", icon: FiCalendar },
    { path: "/admin/payroll", label: "Payroll", icon: FiDollarSign },
    { path: "/admin/reports", label: "Reports", icon: FiBarChart2 },
  ];

  const employeeMenuItems = [
    { path: "/employee/dashboard", label: "Dashboard", icon: FiBarChart2 },
    { path: "/employee/profile", label: "My Profile", icon: FiUser },
    { path: "/employee/attendance", label: "Attendance", icon: FiCalendar },
    { path: "/employee/applyleave", label: "Leave", icon: FiEdit3 },
    { path: "/employee/salary", label: "Salary", icon: FiDollarSign },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 
        lg:sticky lg:top-0 lg:self-start
        w-[18rem] sm:w-[19rem] lg:w-60 xl:w-64
        bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]
        text-slate-900
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        h-full lg:h-screen
        flex flex-col
        border-r border-slate-200/80 shadow-[18px_0_50px_rgba(15,23,42,0.08)]
      `}>

        {/* Header */}
        <div className="border-b border-slate-200/80 p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center text-base font-semibold tracking-tight lg:text-lg">
                <FiSettings className="mr-2 text-lg" />
                {companyLabel}
              </h2>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="rounded-xl p-2 transition-colors hover:bg-slate-100 lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-5 overflow-y-auto p-3 lg:p-4">

          {/* Admin Menu */}
          {role === "admin" && (
            <div className="space-y-3">
              <div className="space-y-1">
                {adminMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center rounded-2xl p-3 transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-blue-600 text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)]"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="mr-3 text-base" />
                      <span className="font-medium">{item.label}</span>
                      {isActive(item.path) && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-emerald-300"></div>
                      )}
                    </Link>
                  );
                })}
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-2">
                <div className="flex items-center gap-2 px-1 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <FiFileText className="h-3.5 w-3.5" />
                  Leave Management
                </div>
                <div className="space-y-1">
                  <SidebarSubLink
                    to="/admin/leaves?tab=requests"
                    active={isLeaveTabActive(location.pathname, location.search, "requests")}
                    label="Leave Requests"
                  />
                  <SidebarSubLink
                    to="/admin/leaves?tab=types"
                    active={isLeaveTabActive(location.pathname, location.search, "types")}
                    label="Leave Types"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Employee Menu */}
          {role === "employee" && (
            <div className="space-y-1">
              {employeeMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center rounded-2xl p-3 transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="mr-3 text-base" />
                    <span className="font-medium">{item.label}</span>
                    {isActive(item.path) && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-emerald-300"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200/80 p-4 lg:p-5">
          <div className="text-center text-xs text-slate-400">
            
          </div>
        </div>

      </aside>
    </>
  );
}

function getCompanyLabel(user) {
  if (user?.company_name) {
    return user.company_name;
  }

  if (user?.tenant_slug) {
    return user.tenant_slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return "Company";
}

function isLeaveTabActive(pathname, search, tab) {
  if (pathname !== "/admin/leaves") {
    return false;
  }

  const params = new URLSearchParams(search);
  return (params.get("tab") || "requests") === tab;
}

function SidebarSubLink({ to, active, label }) {
  return (
    <Link
      to={to}
      className={`flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)]"
          : "text-slate-600 hover:bg-white hover:text-slate-900"
      }`}
    >
      <span className="ml-6">{label}</span>
      {active && <div className="ml-auto h-2 w-2 rounded-full bg-emerald-300" />}
    </Link>
  );
}
