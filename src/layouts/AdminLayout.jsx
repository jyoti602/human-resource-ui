import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);
  const pageMeta = getAdminPageMeta(location.pathname);
  const userName = user?.full_name || user?.name || user?.username || "Admin";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <Sidebar role="admin" isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-5 py-4 sm:hidden">
            <button
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="min-w-0 flex-1 text-center">
              <p className="truncate text-sm font-semibold text-slate-900">{pageMeta.title}</p>
            </div>

            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-3 py-2 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {userInitial}
                </div>
                <FiChevronDown className="h-4 w-4 text-slate-500" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <FiUser className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="hidden flex-col gap-4 px-5 py-4 sm:flex sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0 lg:px-8">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">{pageMeta.title}</p>
              <p className="hidden text-xs text-slate-500 sm:block sm:text-sm">{pageMeta.subtitle}</p>
            </div>
            <div className="flex items-center justify-end gap-3 self-end sm:self-auto">
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white px-3 py-2 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {userInitial}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">{userName}</p>
                    <p className="text-xs text-slate-500">Admin</p>
                  </div>
                  <FiChevronDown className="h-4 w-4 text-slate-500" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                    <Link
                      to="/admin/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <FiUser className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <FiLogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

        <main className="flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
          <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/92 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function getAdminPageMeta(pathname) {
  const routeMap = {
    "/admin/dashboard": {
      title: "Admin Workspace",
      subtitle: "Manage your company operations",
    },
    "/admin/employees": {
      title: "Employee Management",
      subtitle: "Manage employee accounts, departments, and activation status.",
    },
    "/admin/attendance": {
      title: "Attendance Management",
      subtitle: "Track attendance records, check-ins, and work hours.",
    },
    "/admin/leaves": {
      title: "Leave Management",
      subtitle: "Manage leave requests and maintain leave types from one place.",
    },
    "/admin/payroll": {
      title: "Payroll Management",
      subtitle: "Review salary processing, payouts, and employee compensation.",
    },
    "/admin/reports": {
      title: "Reports",
      subtitle: "Monitor HR insights and company performance data.",
    },
    "/admin/cases": {
      title: "All Employee Cases & Requests",
      subtitle: "Manage and review all employee cases, leave requests, and complaints.",
    },
  };

  return (
    routeMap[pathname] || {
      title: "Admin Workspace",
      subtitle: "Manage your company operations",
    }
  );
}
