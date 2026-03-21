import React, { useMemo, useState } from 'react';
import { EmployeeOnly } from '../../components/RoleBasedAccess';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiUser, 
  FiCalendar, 
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiFileText,
  FiSettings
} from "react-icons/fi";
import Card from "../../components/Card";
import {
  formatAttendanceDate,
  getTodayAttendanceRecord,
  hasMarkedAttendanceToday,
  markAttendanceForToday,
} from "../../utils/attendance";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(() => getTodayAttendanceRecord(user));
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const isAttendanceMarked = hasMarkedAttendanceToday(user);
  const checkInLabel = useMemo(() => {
    if (!todayAttendance?.checkInTime) {
      return "Not marked";
    }

    return new Date(todayAttendance.checkInTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [todayAttendance]);

  const handleMarkAttendance = () => {
    try {
      const newRecord = markAttendanceForToday(user);
      setTodayAttendance(newRecord);
      setAttendanceMessage(`Attendance marked for ${formatAttendanceDate(newRecord.date)}.`);
    } catch (error) {
      setAttendanceMessage(error.message);
    }
  };

  return (
    <EmployeeOnly fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">Employee access required to view this page.</p>
        </div>
      </div>
    }>
      <div className="space-y-6 sm:space-y-8 p-3 sm:p-4 lg:p-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Employee Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your attendance, leave requests, and view your profile
            </p>
          </div>
        </div>

        {/* Employee-Specific Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-blue-600">22</p>
                <p className="text-xs text-gray-500">Days Present</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiCalendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leave Balance</p>
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-xs text-gray-500">Days Available</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600">$2,850</p>
                <p className="text-xs text-gray-500">Salary</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiDollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-orange-600">{checkInLabel}</p>
                <p className="text-xs text-gray-500">Check-in</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FiClock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Employee-Only Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleMarkAttendance}
                disabled={isAttendanceMarked}
                className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center justify-between ${
                  isAttendanceMarked
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                <span>{isAttendanceMarked ? "Attendance Marked" : "Mark Attendance"}</span>
                <FiClock className="w-5 h-5" />
              </button>
              {attendanceMessage && (
                <p className="text-sm text-gray-500">{attendanceMessage}</p>
              )}
              <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center justify-between">
                <span>Apply for Leave</span>
                <FiCalendar className="w-5 h-5" />
              </button>
              <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition flex items-center justify-between">
                <span>View Payslip</span>
                <FiDollarSign className="w-5 h-5" />
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition flex items-center justify-between">
                <span>My Profile</span>
                <FiUser className="w-5 h-5" />
              </button>
              <button className="w-full text-left px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition flex items-center justify-between">
                <span>Leave History</span>
                <FiFileText className="w-5 h-5" />
              </button>
              <button className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition flex items-center justify-between">
                <span>Settings</span>
                <FiSettings className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </div>

      </div>
    </EmployeeOnly>
  );
}
