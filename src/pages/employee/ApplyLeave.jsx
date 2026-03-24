import { useEffect, useMemo, useState } from "react";
import LeaveApplicationForm from "../../components/LeaveApplicationForm";
import { employeeAPI, leaveRequestAPI, optionsAPI } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

const getStatusColor = (status) => {
  if (status === "Approved") {
    return "bg-green-100 text-green-700";
  }
  if (status === "Rejected") {
    return "bg-red-100 text-red-700";
  }
  return "bg-yellow-100 text-yellow-700";
};

export default function ApplyLeave() {
  const toast = useToast();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const fetchLeaveData = async () => {
    setLoading(true);
    try {
      const [historyData, leaveTypeData, balanceData] = await Promise.all([
        leaveRequestAPI.getAll(),
        optionsAPI.getLeaveTypes(),
        optionsAPI.getMyLeaveBalances(),
      ]);
      setLeaveHistory(historyData);
      setLeaveTypes(leaveTypeData);
      setLeaveBalances(balanceData);
    } catch (error) {
      toast.error(`Failed to load leave requests: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentEmployee = async () => {
    try {
      const employeeData = await employeeAPI.getMe();
      setCurrentEmployee(employeeData);
    } catch (error) {
      console.error("Failed to load current employee:", error);
    }
  };

  useEffect(() => {
    fetchLeaveData();
    loadCurrentEmployee();
  }, []);

  const leaveSummary = useMemo(() => {
    return {
      total: leaveHistory.length,
      pending: leaveHistory.filter((leave) => leave.status === "Pending").length,
      approved: leaveHistory.filter((leave) => leave.status === "Approved").length,
    };
  }, [leaveHistory]);

  const handleDelete = async (leaveId) => {
    try {
      await leaveRequestAPI.delete(leaveId);
      toast.success("Pending leave request deleted");
      await fetchLeaveData();
    } catch (error) {
      toast.error(`Failed to delete leave request: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-3 lg:p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-gray-500 text-sm">Total Requests</h2>
          <p className="text-2xl font-bold text-slate-700 mt-2">{leaveSummary.total}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-gray-500 text-sm">Pending</h2>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{leaveSummary.pending}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-gray-500 text-sm">Approved</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">{leaveSummary.approved}</p>
        </div>
      </div>

      {leaveBalances.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {leaveBalances.map((balance) => (
            <div key={balance.leave_type} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-gray-700 text-lg font-semibold">{balance.leave_type}</h2>
              <p className="text-3xl font-bold text-green-600 mt-3">{balance.remaining_balance} days</p>
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p>Yearly limit: {balance.max_days_per_year}</p>
                <p>Used this year: {balance.approved_days_taken}</p>
                <p>Carry forward: {balance.carry_forward_days}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Leave Application</h2>
            <p className="mt-1 text-sm text-slate-500">
              Open the leave form in a dialog to keep this page focused on balances and history.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowApplicationForm(true)}
            disabled={!currentEmployee}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply Leave
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Leave History</h2>

        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading leave requests...</div>
        ) : leaveHistory.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No leave requests yet</div>
        ) : (
          <div className="overflow-x-auto thin-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">From</th>
                  <th className="px-6 py-3">To</th>
                  <th className="px-6 py-3">Reason</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Comment</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {leaveHistory.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{leave.leave_type}</td>
                    <td className="px-6 py-4">{leave.from_date}</td>
                    <td className="px-6 py-4">{leave.to_date}</td>
                    <td className="px-6 py-4 max-w-xs">{leave.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {leave.admin_comment || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {leave.status === "Pending" ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(leave.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showApplicationForm && (
        <LeaveApplicationForm
          onClose={() => setShowApplicationForm(false)}
          onSuccess={fetchLeaveData}
          showEmployeeSelector={false}
          employeeId={currentEmployee?.id || ""}
          employeeLabel={currentEmployee?.name || currentEmployee?.full_name || "Current employee"}
          title="Leave Application Form"
          subtitle="Submit your leave request for approval."
        />
      )}
    </div>
  );
}
