import { useState } from "react";

export default function Payroll() {
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("All");

  const payrollData = [
    {
      id: 1,
      name: "Rahul Sharma",
      department: "IT",
      month: "March",
      basic: 30000,
      hra: 5000,
      bonus: 2000,
      deductions: 2000,
      status: "Paid",
    },
    {
      id: 2,
      name: "Priya Verma",
      department: "HR",
      month: "March",
      basic: 28000,
      hra: 4000,
      bonus: 1500,
      deductions: 1500,
      status: "Unpaid",
    },
    {
      id: 3,
      name: "Amit Singh",
      department: "Finance",
      month: "February",
      basic: 32000,
      hra: 6000,
      bonus: 2500,
      deductions: 3000,
      status: "Paid",
    },
  ];

  const filteredPayroll = payrollData.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesMonth =
      monthFilter === "All" || item.month === monthFilter;

    return matchesSearch && matchesMonth;
  });

  const calculateNetSalary = (item) => {
    return item.basic + item.hra + item.bonus - item.deductions;
  };

  const getStatusColor = (status) => {
    return status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Months</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
        </select>
      </div>

      {/* Payroll Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Month</th>
              <th className="px-6 py-3">Basic</th>
              <th className="px-6 py-3">HRA</th>
              <th className="px-6 py-3">Bonus</th>
              <th className="px-6 py-3">Deductions</th>
              <th className="px-6 py-3">Net Salary</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredPayroll.length > 0 ? (
              filteredPayroll.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.department}</td>
                  <td className="px-6 py-4">{item.month}</td>
                  <td className="px-6 py-4">₹{item.basic}</td>
                  <td className="px-6 py-4">₹{item.hra}</td>
                  <td className="px-6 py-4">₹{item.bonus}</td>
                  <td className="px-6 py-4">₹{item.deductions}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    ₹{calculateNetSalary(item)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.status === "Unpaid" && (
                      <button className="text-green-600 hover:underline">
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="text-center py-6 text-gray-500"
                >
                  No payroll records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
