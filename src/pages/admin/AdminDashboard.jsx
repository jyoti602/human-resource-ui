import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminOnly } from "../../components/RoleBasedAccess";
import Card from "../../components/Card";
import { useToast } from "../../contexts/ToastContext";
import {
  attendanceAPI,
  employeeAPI,
  handleApiError,
  leaveRequestAPI,
  optionsAPI,
  payrollAPI,
} from "../../services/api";
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiLayers,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

const currentMonthKey = () => new Date().toISOString().slice(0, 7);

const sameDay = (value, targetDate) => {
  if (!value) return false;
  return new Date(value).toISOString().slice(0, 10) === targetDate;
};

const sameMonth = (value, monthKey) => {
  if (!value) return false;
  return new Date(value).toISOString().slice(0, 7) === monthKey;
};

export default function AdminDashboard() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const month = currentMonthKey();
        const [employeeData, attendanceData, leaveRequestData, payrollData, leaveTypeData] =
          await Promise.all([
            employeeAPI.getAll(),
            attendanceAPI.getAll({ limit: 200 }),
            leaveRequestAPI.getAllForAdmin({ limit: 200 }),
            payrollAPI.getAll({ limit: 200, month }),
            optionsAPI.getAllLeaveTypes(),
          ]);

        setEmployees(employeeData);
        setAttendance(attendanceData);
        setLeaveRequests(leaveRequestData);
        setPayrolls(payrollData);
        setLeaveTypes(leaveTypeData);
      } catch (requestError) {
        const message = handleApiError(requestError);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const monthKey = currentMonthKey();
    const activeEmployees = employees.filter((employee) => employee.status === "Active").length;
    const todaysAttendance = attendance.filter((record) => sameDay(record.date, todayKey));
    const monthlyLeaveRequests = leaveRequests.filter((request) => sameMonth(request.created_at, monthKey));
    const pendingLeaveRequests = leaveRequests.filter((request) => request.status === "Pending");
    const monthlyPayrolls = payrolls.filter((payroll) => payroll.month === monthKey);
    const totalPayroll = monthlyPayrolls.reduce((sum, payroll) => sum + (Number(payroll.net_salary) || 0), 0);
    const processedPayrolls = monthlyPayrolls.filter((payroll) => payroll.status === "processed" || payroll.status === "paid").length;

    return {
      totalEmployees: employees.length,
      activeEmployees,
      todayCheckIns: todaysAttendance.length,
      todayPresent: todaysAttendance.filter((record) => record.status === "Present").length,
      pendingLeaveRequests: pendingLeaveRequests.length,
      monthlyLeaveRequests: monthlyLeaveRequests.length,
      totalPayroll,
      processedPayrolls,
      leaveTypeCount: leaveTypes.filter((type) => type.is_active).length,
    };
  }, [attendance, employees, leaveRequests, leaveTypes, payrolls]);

  const recentAttendance = useMemo(() => {
    return [...attendance]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [attendance]);

  const recentLeaveRequests = useMemo(() => {
    return [...leaveRequests]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [leaveRequests]);

  const recentPayrolls = useMemo(() => {
    return [...payrolls]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [payrolls]);

  return (
    <AdminOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-gray-600">Admin access required to view this page.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-5 p-2 sm:p-3 lg:p-4">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                <FiShield className="h-3.5 w-3.5" />
                Admin Workspace
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Your company at a glance
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Track headcount, leave pressure, attendance, payroll activity, and employee onboarding from one
                place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:min-w-[520px]">
              <QuickChip label="Employees" value={stats.totalEmployees} />
              <QuickChip label="Active" value={stats.activeEmployees} />
              <QuickChip label="Leave Types" value={stats.leaveTypeCount} />
              <QuickChip label="Today" value={stats.todayCheckIns} />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Total Employees"
                value={stats.totalEmployees}
                subtitle={`${stats.activeEmployees} active`}
                icon={<FiUsers className="h-6 w-6 text-blue-600" />}
                accent="from-blue-50 to-blue-100"
              />
              <MetricCard
                label="Pending Leaves"
                value={stats.pendingLeaveRequests}
                subtitle={`${stats.monthlyLeaveRequests} requests this month`}
                icon={<FiClock className="h-6 w-6 text-amber-600" />}
                accent="from-amber-50 to-amber-100"
              />
              <MetricCard
                label="Today Check-ins"
                value={stats.todayPresent}
                subtitle={`${stats.todayCheckIns} total records today`}
                icon={<FiCheckCircle className="h-6 w-6 text-emerald-600" />}
                accent="from-emerald-50 to-emerald-100"
              />
              <MetricCard
                label="Payroll This Month"
                value={formatCurrency(stats.totalPayroll)}
                subtitle={`${stats.processedPayrolls} processed records`}
                icon={<FiDollarSign className="h-6 w-6 text-violet-600" />}
                accent="from-violet-50 to-violet-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Recent Leave Requests</h2>
                    <p className="text-sm text-slate-500">Latest requests from employees in this company.</p>
                  </div>
                  <Link
                    to="/admin/leaves"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Manage Leaves
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {recentLeaveRequests.length > 0 ? (
                    recentLeaveRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">{request.employee_name}</p>
                          <p className="truncate text-sm text-slate-500">
                            {request.leave_type} · {formatDate(request.from_date)} to {formatDate(request.to_date)}
                          </p>
                        </div>
                        <StatusPill status={request.status} />
                      </div>
                    ))
                  ) : (
                    <EmptyState label="No leave requests yet." />
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                  <p className="text-sm text-slate-500">Jump straight to the common admin tasks.</p>
                </div>
                <div className="space-y-3 px-5 py-4">
                  <ShortcutLink to="/admin/employees" icon={<FiUsers />} label="Manage Employees" />
                  <ShortcutLink to="/admin/leaves" icon={<FiCalendar />} label="Review Leave Requests" />
                  <ShortcutLink to="/admin/attendance" icon={<FiActivity />} label="View Attendance" />
                  <ShortcutLink to="/admin/payroll" icon={<FiDollarSign />} label="Open Payroll" />
                  <ShortcutLink to="/admin/reports" icon={<FiTrendingUp />} label="View Reports" />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Today&apos;s Attendance</h2>
                  <p className="text-sm text-slate-500">Latest check-ins recorded for the current day.</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {recentAttendance.length > 0 ? (
                    recentAttendance.map((record) => (
                      <div key={record.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Employee #{record.employee_id}</p>
                          <p className="text-sm text-slate-500">
                            {formatDate(record.date)} · Check-in {formatTime(record.check_in)}
                          </p>
                        </div>
                        <StatusPill status={record.status} />
                      </div>
                    ))
                  ) : (
                    <EmptyState label="No attendance records for today." />
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Payroll Snapshot</h2>
                  <p className="text-sm text-slate-500">Current month payroll activity.</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {recentPayrolls.length > 0 ? (
                    recentPayrolls.map((payroll) => (
                      <div key={payroll.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Employee #{payroll.employee_id}</p>
                          <p className="text-sm text-slate-500">{payroll.month}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{formatCurrency(payroll.net_salary)}</p>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                            {payroll.status || "pending"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState label="No payroll records for this month." />
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Leave Types</h2>
                  <p className="text-sm text-slate-500">Tenant-defined leave policies.</p>
                </div>
                <div className="space-y-3 px-5 py-4">
                  {leaveTypes.length > 0 ? (
                    leaveTypes.slice(0, 6).map((leaveType) => (
                        <div key={leaveType.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{leaveType.name}</p>
                          <p className="text-xs text-slate-500">
                            {leaveType.carry_forward_enabled
                              ? `${leaveType.max_carry_forward_days} carry-forward days`
                              : "No carry forward"}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            leaveType.is_active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {leaveType.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState label="No leave types found." />
                  )}
                  <Link
                    to="/admin/leaves"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiLayers className="h-4 w-4" />
                    Open Leave Management
                  </Link>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </AdminOnly>
  );
}

function MetricCard({ label, value, subtitle, icon, accent }) {
  return (
    <Card>
      <div className={`rounded-2xl bg-gradient-to-br ${accent} p-4`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-3 shadow-sm">{icon}</div>
        </div>
      </div>
    </Card>
  );
}

function QuickChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ShortcutLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <span className="flex items-center gap-3 text-sm font-medium">
        <span className="text-slate-500">{icon}</span>
        {label}
      </span>
      <span className="text-slate-300">→</span>
    </Link>
  );
}

function StatusPill({ status }) {
  const normalized = String(status || "").toLowerCase();
  const className =
    normalized === "approved" || normalized === "present" || normalized === "paid"
      ? "bg-emerald-100 text-emerald-700"
      : normalized === "rejected" || normalized === "absent"
        ? "bg-red-100 text-red-700"
        : normalized === "processed"
          ? "bg-blue-100 text-blue-700"
          : "bg-amber-100 text-amber-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>{status}</span>;
}

function EmptyState({ label }) {
  return <div className="px-5 py-7 text-center text-sm text-slate-500">{label}</div>;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "-";
  const [hours = "00", minutes = "00"] = String(value).split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
