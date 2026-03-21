import { useEffect, useMemo, useState } from "react";

import { attendanceAPI, handleApiError } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

export default function Attendance() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [records, setRecords] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const [attendanceRecords, today] = await Promise.all([
        attendanceAPI.getAll(),
        attendanceAPI.getToday(),
      ]);
      setRecords(attendanceRecords);
      setTodayRecord(today);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const response = await attendanceAPI.checkIn();
      toast.success(response.message);
      await loadAttendance();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const response = await attendanceAPI.checkOut();
      toast.success(response.message);
      await loadAttendance();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleLunchStart = async () => {
    try {
      setActionLoading(true);
      const response = await attendanceAPI.lunchStart();
      toast.success(response.message);
      await loadAttendance();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleLunchEnd = async () => {
    try {
      setActionLoading(true);
      const response = await attendanceAPI.lunchEnd();
      toast.success(response.message);
      await loadAttendance();
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const summary = useMemo(() => {
    const presentDays = records.filter((record) => record.status === "Present").length;
    const absentDays = records.filter((record) => record.status === "Absent").length;
    const lateDays = records.filter((record) => record.status === "Late").length;
    return {
      totalWorkingDays: records.length,
      presentDays,
      absentDays,
      lateDays,
    };
  }, [records]);

  const filteredAttendanceData = useMemo(() => {
    return records.filter((record) => {
      const formattedDate = formatDate(record.date);
      const checkIn = formatTime(record.check_in);
      const checkOut = formatTime(record.check_out);
      const matchesSearch =
        formattedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkIn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checkOut.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-700";
      case "Absent":
        return "bg-red-100 text-red-700";
      case "Late":
        return "bg-orange-100 text-orange-700";
      case "Half Day":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const canCheckIn = !todayRecord?.check_in;
  const canStartLunch =
    Boolean(todayRecord?.check_in) &&
    !todayRecord?.lunch_start &&
    !todayRecord?.check_out;
  const canEndLunch =
    Boolean(todayRecord?.lunch_start) &&
    !todayRecord?.lunch_end &&
    !todayRecord?.check_out;
  const canCheckOut = Boolean(todayRecord?.check_in) && !todayRecord?.check_out;

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">My Attendance</h1>

      <div className="mb-6 rounded-xl bg-white p-5 shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Today's Attendance</h2>
            <p className="text-sm text-gray-500">
              {todayRecord?.check_in
                ? `Checked in at ${formatTime(todayRecord.check_in)}`
                : "You have not checked in yet today."}
            </p>
            {todayRecord?.check_out && (
              <p className="mt-1 text-sm text-gray-500">
                Checked out at {formatTime(todayRecord.check_out)}
              </p>
            )}
            {todayRecord?.lunch_start && (
              <p className="mt-1 text-sm text-gray-500">
                Lunch started at {formatTime(todayRecord.lunch_start)}
                {todayRecord?.lunch_end ? ` and ended at ${formatTime(todayRecord.lunch_end)}` : ""}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCheckIn}
              disabled={!canCheckIn || actionLoading}
              className={`rounded-lg px-5 py-2 font-medium transition ${
                !canCheckIn || actionLoading
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Check In
            </button>
            <button
              onClick={handleLunchStart}
              disabled={!canStartLunch || actionLoading}
              className={`rounded-lg px-5 py-2 font-medium transition ${
                !canStartLunch || actionLoading
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              }`}
            >
              Lunch Start
            </button>
            <button
              onClick={handleLunchEnd}
              disabled={!canEndLunch || actionLoading}
              className={`rounded-lg px-5 py-2 font-medium transition ${
                !canEndLunch || actionLoading
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              Lunch End
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!canCheckOut || actionLoading}
              className={`rounded-lg px-5 py-2 font-medium transition ${
                !canCheckOut || actionLoading
                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by date, time, or status"
          className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:min-w-[280px]"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
          <option value="Half Day">Half Day</option>
        </select>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <SummaryCard label="Total Days" value={summary.totalWorkingDays} />
        <SummaryCard label="Present Days" value={summary.presentDays} valueClassName="text-green-600" />
        <SummaryCard label="Absent Days" value={summary.absentDays} valueClassName="text-red-600" />
        <SummaryCard label="Late Days" value={summary.lateDays} valueClassName="text-orange-600" />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Attendance History</h2>

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading attendance...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Check In</th>
                <th className="px-6 py-3">Lunch Start</th>
                <th className="px-6 py-3">Lunch End</th>
                <th className="px-6 py-3">Check Out</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Hours</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredAttendanceData.length > 0 ? (
                filteredAttendanceData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{formatDate(record.date)}</td>
                    <td className="px-6 py-4">{formatTime(record.check_in)}</td>
                    <td className="px-6 py-4">{formatTime(record.lunch_start)}</td>
                    <td className="px-6 py-4">{formatTime(record.lunch_end)}</td>
                    <td className="px-6 py-4">{formatTime(record.check_out)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{record.work_hours ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, valueClassName = "" }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-md">
      <h2 className="text-sm text-gray-500">{label}</h2>
      <p className={`mt-2 text-2xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) {
    return "-";
  }

  const timeValue = typeof value === "string" ? value : String(value);
  const [hours = "00", minutes = "00"] = timeValue.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
