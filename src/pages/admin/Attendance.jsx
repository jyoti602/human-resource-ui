import { useEffect, useMemo, useState } from "react";

import { attendanceAPI, employeeAPI, handleApiError } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

export default function AdminAttendance() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        const [attendanceRecords, employees] = await Promise.all([
          attendanceAPI.getAll(),
          employeeAPI.getAll(),
        ]);

        const employeeMap = new Map(employees.map((employee) => [employee.id, employee]));
        const merged = attendanceRecords.map((record) => {
          const employee = employeeMap.get(record.employee_id);
          return {
            ...record,
            name: employee?.name || "Unknown",
            department: employee?.department || "-",
          };
        });

        setAttendanceData(merged);
      } catch (error) {
        toast.error(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  const filteredData = useMemo(() => {
    return attendanceData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [attendanceData, filter, search]);

  const getStatusColor = (status) => {
    if (status === "Present") return "bg-green-100 text-green-700";
    if (status === "Absent") return "bg-red-100 text-red-700";
    if (status === "Late") return "bg-orange-100 text-orange-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Admin Attendance Management</h1>

      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-64 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
          <option value="Half Day">Half Day</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading attendance...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Employee Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Check In</th>
                <th className="px-6 py-3">Lunch Start</th>
                <th className="px-6 py-3">Lunch End</th>
                <th className="px-6 py-3">Check Out</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{item.id}</td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4">{item.department}</td>
                    <td className="px-6 py-4">{formatDate(item.date)}</td>
                    <td className="px-6 py-4">{formatTime(item.check_in)}</td>
                    <td className="px-6 py-4">{formatTime(item.lunch_start)}</td>
                    <td className="px-6 py-4">{formatTime(item.lunch_end)}</td>
                    <td className="px-6 py-4">{formatTime(item.check_out)}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-6 text-center text-gray-500">
                    No records found
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

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB");
}

function formatTime(value) {
  if (!value) {
    return "-";
  }

  const [hours = "00", minutes = "00"] = String(value).split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
