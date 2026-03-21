import React, { useState, useEffect } from 'react';
import { EmployeeOnly } from '../../components/RoleBasedAccess';
import { 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiPlus,
  FiFilter,
  FiSearch,
  FiEye
} from 'react-icons/fi';
import Card from '../../components/Card';

export default function EmployeeCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch employee-specific cases
    fetchEmployeeCases();
  }, []);

  const fetchEmployeeCases = async () => {
    try {
      // Mock employee cases data
      const employeeCases = [
        {
          id: 1,
          type: 'leave',
          title: 'Annual Leave Request',
          description: 'Request for 5 days annual leave',
          status: 'pending',
          submittedDate: '2024-03-15',
          employeeName: 'John Doe',
          priority: 'medium'
        },
        {
          id: 2,
          type: 'attendance',
          title: 'Attendance Correction',
          description: 'Request to correct attendance for March 10',
          status: 'approved',
          submittedDate: '2024-03-10',
          employeeName: 'John Doe',
          priority: 'low'
        },
        {
          id: 3,
          type: 'salary',
          title: 'Salary Slip Request',
          description: 'Request for February 2024 salary slip',
          status: 'completed',
          submittedDate: '2024-03-01',
          employeeName: 'John Doe',
          priority: 'low'
        }
      ];
      
      setCases(employeeCases);
    } catch (error) {
      console.error('Error fetching employee cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesFilter = filter === 'all' || caseItem.status === filter;
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'approved': return <FiCheckCircle className="w-4 h-4" />;
      case 'rejected': return <FiXCircle className="w-4 h-4" />;
      case 'completed': return <FiCheckCircle className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
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
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              My Cases & Requests
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage your leave requests, attendance issues, and other cases
            </p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <FiPlus className="w-5 h-5" />
            <span>New Request</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {cases.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {cases.filter(c => c.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {cases.filter(c => c.status === 'rejected').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FiXCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {cases.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiCheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FiFilter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Cases</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Cases List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredCases.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500">No cases found matching your criteria.</p>
              </div>
            </Card>
          ) : (
            filteredCases.map(caseItem => (
              <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{caseItem.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(caseItem.status)}`}>
                        {getStatusIcon(caseItem.status)}
                        <span>{caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{caseItem.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Submitted: {caseItem.submittedDate}</span>
                      <span>Priority: {caseItem.priority}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <FiEye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </EmployeeOnly>
  );
}
