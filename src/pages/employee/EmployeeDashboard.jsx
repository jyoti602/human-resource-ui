import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmployeeOnly } from "../../components/RoleBasedAccess";
import Card from "../../components/Card";
import { useAuth } from "../../contexts/AuthContext";
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
  FiClock,
  FiDollarSign,
  FiFileText,
  FiUser,
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

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const month = currentMonthKey();
        const [profileData, todayData, attendanceData, leaveRequestData, balanceData, payrollData, leaveTypeData] =
          await Promise.all([
            employeeAPI.getMe(),
            attendanceAPI.getToday(),
            attendanceAPI.getAll({ limit: 200 }),
            leaveRequestAPI.getAll({ limit: 200 }),
            optionsAPI.getMyLeaveBalances(),
            payrollAPI.getAll({ limit: 50 }),
            optionsAPI.getLeaveTypes(),
          ]);

        setProfile(profileData);
        setTodayAttendance(todayData);
        setAttendanceHistory(attendanceData);
        setLeaveRequests(leaveRequestData);
        setLeaveBalances(balanceData);
        setPayrolls(payrollData.filter((item) => item.month === month));
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

  const handleMarkAttendance = async () => {
    try {
      setActionLoading(true);
      const response = await attendanceAPI.checkIn();
      setTodayAttendance(response.attendance);
      setAttendanceHistory((current) => [response.attendance, ...current]);
      toast.success(response.message);
    } catch (requestError) {
      const message = handleApiError(requestError);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const monthKey = currentMonthKey();
  const checkedInToday = Boolean(todayAttendance?.check_in);
  const currentMonthAttendance = useMemo(
    () => attendanceHistory.filter((record) => sameMonth(record.date, monthKey)),
    [attendanceHistory]
  );
  const currentMonthLeaveRequests = useMemo(
    () => leaveRequests.filter((request) => sameMonth(request.created_at, monthKey)),
    [leaveRequests]
  );
  const recentAttendance = useMemo(
    () => [...attendanceHistory].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [attendanceHistory]
  );
  const recentLeaveRequests = useMemo(
    () => [...leaveRequests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    [leaveRequests]
  );
  const latestPayroll = useMemo(
    () => [...payrolls].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null,
    [payrolls]
  );
  const leaveSummary = useMemo(() => {
    const approved = currentMonthLeaveRequests.filter((request) => request.status === "Approved").length;
    const pending = currentMonthLeaveRequests.filter((request) => request.status === "Pending").length;
    return { approved, pending };
  }, [currentMonthLeaveRequests]);
  const attendanceSummary = useMemo(() => {
    const present = currentMonthAttendance.filter((record) => record.status === "Present").length;
    const late = currentMonthAttendance.filter((record) => record.status === "Late").length;
    const totalHours = currentMonthAttendance.reduce((sum, record) => sum + (Number(record.work_hours) || 0), 0);
    return { present, late, totalHours };
  }, [currentMonthAttendance]);

  const primaryBalance = leaveBalances[0] || null;

  return (
    <EmployeeOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-gray-600">Employee access required to view this page.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-5 p-2 sm:p-3 lg:p-4">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                <FiUser className="h-3.5 w-3.5" />
                Employee Workspace
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back, {profile?.name || user?.full_name || user?.username || "Employee"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Check your attendance status, leave balances, recent requests, and payroll updates in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:min-w-[520px]">
              <QuickChip label="Present" value={attendanceSummary.present} />
              <QuickChip label="Leaves" value={leaveSummary.pending + leaveSummary.approved} />
              <QuickChip label="Balance" value={primaryBalance?.remaining_balance ?? 0} />
              <QuickChip label="Hours" value={attendanceSummary.totalHours} />
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
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Today Check-in"
                value={checkedInToday ? formatTime(todayAttendance?.check_in) : "Not marked"}
                subtitle={checkedInToday ? "Attendance recorded" : "Tap mark attendance"}
                icon={<FiClock className="h-6 w-6 text-blue-600" />}
                accent="from-blue-50 to-blue-100"
              />
              <MetricCard
                label="Current Leave Balance"
                value={primaryBalance?.remaining_balance ?? 0}
                subtitle={primaryBalance ? `${primaryBalance.leave_type} leave` : "No balance loaded"}
                icon={<FiCalendar className="h-6 w-6 text-emerald-600" />}
                accent="from-emerald-50 to-emerald-100"
              />
              <MetricCard
                label="This Month Payroll"
                value={latestPayroll ? formatCurrency(latestPayroll.net_salary) : "-"}
                subtitle={latestPayroll ? latestPayroll.status : "No payroll yet"}
                icon={<FiDollarSign className="h-6 w-6 text-violet-600" />}
                accent="from-violet-50 to-violet-100"
              />
              <MetricCard
                label="Requests This Month"
                value={currentMonthLeaveRequests.length}
                subtitle={`${leaveSummary.pending} pending`}
                icon={<FiFileText className="h-6 w-6 text-amber-600" />}
                accent="from-amber-50 to-amber-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Today&apos;s Attendance</h2>
                    <p className="text-sm text-slate-500">
                      {checkedInToday
                        ? `Checked in at ${formatTime(todayAttendance.check_in)}`
                        : "You have not checked in yet today."}
                    </p>
                  </div>
                  <button
                    onClick={handleMarkAttendance}
                    disabled={checkedInToday || actionLoading}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      checkedInToday || actionLoading
                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {checkedInToday ? "Marked" : "Mark Attendance"}
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2">
                    <InfoTile label="Status" value={todayAttendance?.status || "Not marked"} />
                    <InfoTile label="Work Hours" value={todayAttendance?.work_hours ?? 0} />
                    <InfoTile label="Lunch Start" value={formatTime(todayAttendance?.lunch_start)} />
                    <InfoTile label="Lunch End" value={formatTime(todayAttendance?.lunch_end)} />
                  </div>
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <FiActivity className="h-5 w-5 text-slate-500" />
                      <p className="text-sm text-slate-600">
                        {attendanceHistory.length > 0
                          ? `You have ${attendanceHistory.length} recorded attendance entries in total.`
                          : "Attendance history will appear here after the first check-in."}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                  <p className="text-sm text-slate-500">Common tasks you can jump into quickly.</p>
                </div>
                <div className="space-y-3 px-5 py-4">
                  <ShortcutLink to="/employee/attendance" icon={<FiClock />} label="Open Attendance" />
                  <ShortcutLink to="/employee/dashboard?openLeave=1" icon={<FiCalendar />} label="Apply for Leave" />
                  <ShortcutLink to="/employee/profile" icon={<FiUser />} label="View Profile" />
                  <ShortcutLink to="/employee/salary" icon={<FiDollarSign />} label="View Salary" />
                  <ShortcutLink to="/employee/cases" icon={<FiFileText />} label="My Cases" />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Leave Balance</h2>
                  <p className="text-sm text-slate-500">Your tenant leave policies and remaining balances.</p>
                </div>
                <div className="space-y-3 px-5 py-4">
                  {leaveBalances.length > 0 ? (
                    leaveBalances.map((balance) => (
                      <div key={balance.leave_type} className="rounded-2xl bg-slate-50 px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{balance.leave_type}</p>
                            <p className="text-xs text-slate-500">
                              {balance.approved_days_taken} used · {balance.carry_forward_days} carry forward
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-emerald-600">{balance.remaining_balance}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState label="No leave balances available." />
                  )}
                  {leaveTypes.length > 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      Active leave types: {leaveTypes.map((type) => type.name).join(", ")}
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Recent Leave Requests</h2>
                    <p className="text-sm text-slate-500">Your latest leave submissions and statuses.</p>
                  </div>
                  <Link
                    to="/employee/dashboard?openLeave=1"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    New Request
                  </Link>
                </div>
                <div className="divide-y divide-slate-100">
                  {recentLeaveRequests.length > 0 ? (
                    recentLeaveRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {request.leave_type} · {formatDate(request.from_date)} to {formatDate(request.to_date)}
                          </p>
                          <p className="truncate text-sm text-slate-500">{request.reason}</p>
                        </div>
                        <StatusPill status={request.status} />
                      </div>
                    ))
                  ) : (
                    <EmptyState label="No leave requests yet." />
                  )}
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Recent Attendance</h2>
                  <p className="text-sm text-slate-500">Your latest check-in and attendance entries.</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {recentAttendance.length > 0 ? (
                    recentAttendance.map((record) => (
                      <div key={record.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{formatDate(record.date)}</p>
                          <p className="text-sm text-slate-500">
                            In {formatTime(record.check_in)} · Out {formatTime(record.check_out)}
                          </p>
                        </div>
                        <StatusPill status={record.status} />
                      </div>
                    ))
                  ) : (
                    <EmptyState label="No attendance history yet." />
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Payroll Snapshot</h2>
                  <p className="text-sm text-slate-500">Latest payroll entries for the current month.</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {payrolls.length > 0 ? (
                    payrolls.slice(0, 3).map((payroll) => (
                      <div key={payroll.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{payroll.month}</p>
                          <p className="text-sm text-slate-500">{payroll.payment_method || "Payment pending"}</p>
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
                    <EmptyState label="No payroll records available." />
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </EmployeeOnly>
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

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
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
