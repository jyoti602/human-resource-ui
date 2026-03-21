import React, { useState, useEffect } from 'react';
import { AdminOnly } from '../../components/RoleBasedAccess';
import { 
  FiUsers, 
  FiCalendar, 
  FiCheckCircle, 
  FiXCircle,
  FiPlus,
  FiFilter,
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiTrendingUp
} from 'react-icons/fi';
import Card from '../../components/Card';

export default function AdminCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch all cases for admin
    fetchAllCases();
  }, []);

  const fetchAllCases = async () => {
    try {
      // Mock admin cases data (all employees' cases)
      const allCases = [
        {
          id: 1,
          type: 'leave',
          title: 'Annual Leave Request',
          description: 'Request for 5 days annual leave',
          status: 'pending',
          submittedDate: '2024-03-15',
          employeeName: 'John Doe',
          employeeId: 'EMP001',
          department: 'Engineering',
          priority: 'medium'
        },
        {
          id: 2,
          type: 'leave',
          title: 'Medical Leave',
          description: 'Medical leave for 3 days',
          status: 'approved',
          submittedDate: '2024-03-14',
          employeeName: 'Jane Smith',
          employeeId: 'EMP002',
          department: 'HR',
          priority: 'high'
        },
        {
          id: 3,
          type: 'attendance',
          title: 'Attendance Correction',
          description: 'Request to correct attendance for March 10',
          status: 'pending',
          submittedDate: '2024-03-12',
          employeeName: 'Mike Johnson',
          employeeId: 'EMP003',
          department: 'Sales',
          priority: 'low'
        },
        {
          id: 4,
          type: 'salary',
          title: 'Salary Slip Request',
          description: 'Request for February 2024 salary slip',
          status: 'completed',
          submittedDate: '2024-03-01',
          employeeName: 'Sarah Wilson',
          employeeId: 'EMP004',
          department: 'Marketing',
          priority: 'low'
        },
        {
          id: 5,
          type: 'complaint',
          title: 'Workplace Harassment Complaint',
          description: 'Complaint regarding workplace behavior',
          status: 'pending',
          submittedDate: '2024-03-16',
          employeeName: 'Tom Brown',
          employeeId: 'EMP005',
          department: 'Operations',
          priority: 'high'
        }
      ];
      
      setCases(allCases);
    } catch (error) {
      console.error('Error fetching admin cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesFilter = filter === 'all' || caseItem.status === filter;
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = async (caseId) => {
    try {
      // Mock approval logic
      setCases(cases.map(c => 
        c.id === caseId ? { ...c, status: 'approved' } : c
      ));
      alert('Case approved successfully!');
    } catch (error) {
      console.error('Error approving case:', error);
      alert('Error approving case');
    }
  };

  const handleReject = async (caseId) => {
    try {
      // Mock rejection logic
      setCases(cases.map(c => 
        c.id === caseId ? { ...c, status: 'rejected' } : c
      ));
      alert('Case rejected successfully!');
    } catch (error) {
      console.error('Error rejecting case:', error);
      alert('Error rejecting case');
    }
  };

  return (
    <AdminOnly fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">Admin access required to view this page.</p>
        </div>
      </div>
    }>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              All Employee Cases & Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and review all employee cases, leave requests, and complaints
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <FiTrendingUp className="w-5 h-5" />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <FiPlus className="w-5 h-5" />
              <span>Create Case</span>
            </button>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cases</p>
                <p className="text-2xl font-bold text-blue-600">{cases.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {cases.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FiCalendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {cases.filter(c => c.priority === 'high').length}
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
                <p className="text-sm text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FiFilter className="w-6 h-6 text-orange-600" />
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
                  placeholder="Search cases by title, description, or employee name..."
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
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{caseItem.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                          {caseItem.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{caseItem.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-500">
                      <span>Employee: {caseItem.employeeName}</span>
                      <span>ID: {caseItem.employeeId}</span>
                      <span>Dept: {caseItem.department}</span>
                      <span>Submitted: {caseItem.submittedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {caseItem.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleApprove(caseItem.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Approve"
                        >
                          <FiCheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleReject(caseItem.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Reject"
                        >
                          <FiXCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Details">
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition" title="Edit">
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminOnly>
  );
}
