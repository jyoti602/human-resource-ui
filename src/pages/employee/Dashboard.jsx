import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import { 
  FiBarChart2, 
  FiCalendar, 
  FiUmbrella, 
  FiDollarSign,
  FiStar,
  FiEdit3,
  FiUser,
  FiTarget,
  FiGift
} from "react-icons/fi";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-4 lg:p-6">

      {/* Header Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Employee Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Welcome back 👋 Here's your personal overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-indigo-500">
          <Card 
            title="My Attendance" 
            value="22 / 26 Days" 
            subtitle="84.6% this month"
            trend={{ type: 'up', value: '3%', label: 'from last month' }}
            icon={<FiBarChart2 className="text-2xl" />}
          />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-green-500">
          <Card 
            title="Leave Balance" 
            value="8 Days" 
            subtitle="Available leaves"
            trend={{ type: 'neutral', value: '2 days used', label: 'this quarter' }}
            icon={<FiUmbrella className="text-2xl" />}
          />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-yellow-500">
          <Card 
            title="This Month Salary" 
            value="₹35,000" 
            subtitle="Net after deductions"
            trend={{ type: 'up', value: '5%', label: 'bonus included' }}
            icon={<FiDollarSign className="text-2xl" />}
          />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-pink-500">
          <Card 
            title="Performance Rating" 
            value="4.5 / 5" 
            subtitle="Excellent performance"
            trend={{ type: 'up', value: '0.3', label: 'from last review' }}
            icon={<FiStar className="text-2xl" />}
          />
        </div>

      </div>

      {/* Quick Actions Section */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          <button
            onClick={() => navigate("/employee/applyleave")}
            className="px-4 sm:px-6 py-3 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium flex items-center justify-center"
          >
            <FiEdit3 className="mr-2" />
            Apply for Leave
          </button>

          <button
            onClick={() => navigate("/employee/attendance")}
            className="px-4 sm:px-6 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center justify-center"
          >
            <FiCalendar className="mr-2" />
            View Attendance
          </button>

          <button
            onClick={() => navigate("/employee/salary")}
            className="px-4 sm:px-6 py-3 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium flex items-center justify-center"
          >
            <FiDollarSign className="mr-2" />
            Download Payslip
          </button>

          <button
            onClick={() => navigate("/employee/profile")}
            className="px-4 sm:px-6 py-3 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium flex items-center justify-center"
          >
            <FiUser className="mr-2" />
            Update Profile
          </button>

        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">
          Your Recent Activity
        </h2>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Attendance marked</p>
              <p className="text-xs text-gray-500">Check-in at 9:15 AM today</p>
              <p className="text-xs text-gray-400 mt-1">Today, 9:15 AM</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Leave approved</p>
              <p className="text-xs text-gray-500">Your sick leave for Dec 15-16 was approved</p>
              <p className="text-xs text-gray-400 mt-1">Yesterday, 2:30 PM</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Payslip available</p>
              <p className="text-xs text-gray-500">November 2024 payslip is ready for download</p>
              <p className="text-xs text-gray-400 mt-1">Dec 1, 10:00 AM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">
          Upcoming Events
        </h2>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <FiCalendar className="text-blue-600 text-xl" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Team Meeting</p>
              <p className="text-xs text-gray-500">Tomorrow at 2:00 PM - Conference Room A</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
            <FiTarget className="text-green-600 text-xl" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Performance Review</p>
              <p className="text-xs text-gray-500">Dec 20, 2024 - 11:00 AM with Manager</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <FiGift className="text-purple-600 text-xl" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Company Holiday</p>
              <p className="text-xs text-gray-500">Dec 25, 2024 - Christmas Day</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}