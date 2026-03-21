import React from 'react';
import { AdminOnly } from '../../components/RoleBasedAccess';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiCalendar, 
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiUserPlus,
  FiCheckSquare,
  FiCreditCard,
  FiFileText
} from "react-icons/fi";
import Card from "../../components/Card";

export default function AdminDashboard() {
  return (
    <AdminOnly fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">Admin access required to view this page.</p>
        </div>
      </div>
    }>
      <div className="space-y-6 sm:space-y-8 p-3 sm:p-4 lg:p-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage employees, payroll, and system settings
            </p>
          </div>
        </div>

        {/* Admin-Specific Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-800">24</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FiCheckSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold text-green-600">$48,500</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leave Requests</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiCalendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Admin-Only Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Management</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition flex items-center justify-between">
                <span>View All Employees</span>
                <FiUsers className="w-5 h-5" />
              </button>
              <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition flex items-center justify-between">
                <span>Registration Approvals</span>
                <FiUserPlus className="w-5 h-5" />
              </button>
              <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition flex items-center justify-between">
                <span>Department Management</span>
                <FiFileText className="w-5 h-5" />
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Administration</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition flex items-center justify-between">
                <span>Payroll Management</span>
                <FiCreditCard className="w-5 h-5" />
              </button>
              <button className="w-full text-left px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition flex items-center justify-between">
                <span>Attendance Reports</span>
                <FiCalendar className="w-5 h-5" />
              </button>
              <button className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition flex items-center justify-between">
                <span>System Settings</span>
                <FiFileText className="w-5 h-5" />
              </button>
            </div>
          </Card>
        </div>

      </div>
    </AdminOnly>
  );
}
