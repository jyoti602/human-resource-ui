import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";

export default function ApplyLeave() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [leaveHistory, setLeaveHistory] = useState([
    {
      id: 1,
      type: "Medical Leave",
      from: "2026-02-10",
      to: "2026-02-12",
      status: "Approved",
    },
    {
      id: 2,
      type: "Casual Leave",
      from: "2026-03-01",
      to: "2026-03-02",
      status: "Pending",
    },
  ]);

  const leaveBalance = {
    casual: 8,
    medical: 5,
    earned: 10,
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newLeave = {
      id: leaveHistory.length + 1,
      type: formData.leaveType,
      from: formData.fromDate,
      to: formData.toDate,
      status: "Pending",
    };

    setLeaveHistory([...leaveHistory, newLeave]);

    setFormData({
      leaveType: "Casual Leave",
      fromDate: "",
      toDate: "",
      reason: "",
    });

    toast.success("Leave request submitted successfully!");
  };

  const getStatusColor = (status) => {
    if (status === "Approved")
      return "bg-green-100 text-green-700";
    if (status === "Rejected")
      return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Apply for Leave
      </h1>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-gray-500 text-sm">Casual Leave</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {leaveBalance.casual} Days
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-gray-500 text-sm">Medical Leave</h2>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {leaveBalance.medical} Days
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5">
          <h2 className="text-gray-500 text-sm">Earned Leave</h2>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {leaveBalance.earned} Days
          </p>
        </div>
      </div>

      {/* Leave Form */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Leave Application Form
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

          <div>
            <label className="block mb-1 font-medium">
              Leave Type
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Casual Leave</option>
              <option>Medical Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">
              Reason
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              required
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
            >
              Submit Leave Request
            </button>
          </div>

        </form>
      </div>

      {/* Leave History Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Leave History
        </h2>

        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">From</th>
              <th className="px-6 py-3">To</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {leaveHistory.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{leave.id}</td>
                <td className="px-6 py-4">{leave.type}</td>
                <td className="px-6 py-4">{leave.from}</td>
                <td className="px-6 py-4">{leave.to}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      leave.status
                    )}`}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
