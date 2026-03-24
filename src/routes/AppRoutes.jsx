import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AdminRoute, EmployeeRoute } from "../components/ProtectedRoute";
import { getTenantSlugFromHost } from "../services/api";

/* ================= PUBLIC PAGES ================= */
import Landing from "../pages/Landing";
import Features from "../pages/Features";
import About from "../pages/About";
import Contact from "../pages/Contact";
import CompanyRegister from "../pages/CompanyRegister";
import Login from "../pages/Login";

/* ================= LAYOUTS ================= */
import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAttendance from "../pages/admin/Attendance";
import AdminCases from "../pages/admin/AdminCases";
import Employees from "../pages/admin/Employees";
import Leaves from "../pages/admin/Leaves";
import Payroll from "../pages/admin/Payroll";
import Reports from "../pages/admin/Reports";
import AdminProfile from "../pages/admin/Profile";

/* ================= EMPLOYEE PAGES ================= */
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeAttendance from "../pages/employee/Attendance";
import EmployeeCases from "../pages/employee/EmployeeCases";
import ApplyLeave from "../pages/employee/ApplyLeave";
import Salary from "../pages/employee/Salary";
import Profile from "../pages/employee/Profile";

export default function AppRoutes() {
  const isTenantWorkspace = Boolean(getTenantSlugFromHost());

  return (
    <BrowserRouter>
      <div className="bg-gray-100 min-h-screen">
        <Routes>

          {/* ================= PUBLIC ================= */}

          <Route path="/" element={isTenantWorkspace ? <Navigate to="/login" replace /> : <Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register-company" element={<CompanyRegister />} />
          <Route path="/login" element={<Login />} />
          {/* ================= ADMIN ================= */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="cases" element={<AdminCases />} />
            <Route path="employees" element={<Employees />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<AdminProfile />} />

          </Route>


          {/* ================= EMPLOYEE ================= */}

          <Route
            path="/employee"
            element={
              <EmployeeRoute>
                <EmployeeLayout />
              </EmployeeRoute>
            }
          >

            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="cases" element={<EmployeeCases />} />
            <Route path="applyleave" element={<ApplyLeave />} />
            <Route path="salary" element={<Salary />} />
            <Route path="profile" element={<Profile />} />

          </Route>

        </Routes>
      </div>
    </BrowserRouter>
  );
}
