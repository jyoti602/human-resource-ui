import Card from "../../components/Card";
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

export default function AdminDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-4 lg:p-6">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Welcome back, Admin 👋 Here's what's happening today.
          </p>
        </div>

        <button className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center">
          <FiUserPlus className="mr-2" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-indigo-500">
          <Card 
            title="Total Employees" 
            value="120" 
            subtitle="Active staff members"
            trend={{ type: 'up', value: '12%', label: 'from last month' }}
            icon={<FiUsers className="text-2xl" />}
          />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-green-500">
          <Card 
            title="Present Today" 
            value="98" 
            subtitle="81.7% attendance rate"
            trend={{ type: 'up', value: '5%', label: 'from yesterday' }}
            icon={<FiCheckCircle className="text-2xl" />}
          />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-yellow-500">
          <Card 
            title="Pending Leaves" 
            value="12" 
            subtitle="Awaiting approval"
            trend={{ type: 'down', value: '3', label: 'from last week' }}
            icon={<FiCalendar className="text-2xl" />}
          />
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-200 border-l-4 border-red-500">
          <Card 
            title="Monthly Payroll" 
            value="₹4,50,000" 
            subtitle="Total disbursement"
            trend={{ type: 'up', value: '8%', label: 'from last month' }}
            icon={<FiDollarSign className="text-2xl" />}
          />
        </div>

      </div>

      {/* Quick Actions Section */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button className="px-4 sm:px-6 py-3 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium flex items-center justify-center">
            <FiUsers className="mr-2" />
            Manage Employees
          </button>

          <button className="px-4 sm:px-6 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center justify-center">
            <FiCheckSquare className="mr-2" />
            Approve Leaves
          </button>

          <button className="px-4 sm:px-6 py-3 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium flex items-center justify-center">
            <FiCreditCard className="mr-2" />
            Generate Payroll
          </button>

          <button className="px-4 sm:px-6 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center justify-center">
            <FiFileText className="mr-2" />
            View Reports
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">
          Recent Activity
        </h2>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">New employee onboarded</p>
              <p className="text-xs text-gray-500">John Doe joined as Software Engineer</p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Leave request pending</p>
              <p className="text-xs text-gray-500">Sarah Smith requested 3 days leave</p>
              <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">Payroll processed</p>
              <p className="text-xs text-gray-500">Monthly payroll for November generated</p>
              <p className="text-xs text-gray-400 mt-1">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}