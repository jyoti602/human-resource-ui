import { useState } from "react";

export default function Reports() {
  const [month, setMonth] = useState("March");

  const summary = {
    totalEmployees: 45,
    attendanceRate: "92%",
    totalLeaves: 12,
    payrollProcessed: "₹12,50,000",
  };

  const departmentData = [
    { department: "IT", count: 18 },
    { department: "HR", count: 8 },
    { department: "Finance", count: 10 },
    { department: "Marketing", count: 9 },
  ];

  const monthlyAttendance = [
    { date: "01 March", present: 42, absent: 3 },
    { date: "02 March", present: 40, absent: 5 },
    { date: "03 March", present: 44, absent: 1 },
    { date: "04 March", present: 43, absent: 2 },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-gray-500 text-sm">Total Employees</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {summary.totalEmployees}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-gray-500 text-sm">Attendance Rate</h2>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {summary.attendanceRate}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-gray-500 text-sm">Total Leaves</h2>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {summary.totalLeaves}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-gray-500 text-sm">Payroll Processed</h2>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {summary.payrollProcessed}
          </p>
        </div>
      </div>

      {/* Department Report */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Department-wise Employees
        </h2>

        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Total Employees</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {departmentData.map((dept, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">{dept.department}</td>
                <td className="px-6 py-4 font-medium">
                  {dept.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Attendance Report */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Attendance ({month})
        </h2>

        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Present</th>
              <th className="px-6 py-3">Absent</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {monthlyAttendance.map((day, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">{day.date}</td>
                <td className="px-6 py-4 text-green-600 font-medium">
                  {day.present}
                </td>
                <td className="px-6 py-4 text-red-600 font-medium">
                  {day.absent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
