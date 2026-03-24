import { useEffect, useMemo, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";

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
    <div className="space-y-4 p-4 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="relative w-full lg:w-56">
          <FiFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading attendance...</div>
        ) : (
          <div className="overflow-x-auto thin-scrollbar">
            <table className="min-w-[980px] w-full text-left">
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
          </div>
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
