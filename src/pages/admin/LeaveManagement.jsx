import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import {
  FiCalendar,
  FiCheck,
  FiEdit2,
  FiEye,
  FiFileText,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
} from 'react-icons/fi';

import LeaveApplicationForm from '../../components/LeaveApplicationForm';
import Pagination from '../../components/Pagination';
import { useToast } from '../../contexts/ToastContext';
import { leaveRequestAPI, optionsAPI } from '../../services/api';

const initialLeaveTypeForm = {
  name: '',
  description: '',
  max_days_per_year: 0,
  carry_forward_enabled: false,
  max_carry_forward_days: 0,
};

const getLeaveTypeLabel = (type) => {
  const labels = {
    Casual: 'Casual Leave',
    Sick: 'Sick Leave',
    Annual: 'Annual Leave',
    Maternity: 'Maternity Leave',
    Paternity: 'Paternity Leave',
    Emergency: 'Emergency Leave',
  };
  return labels[type] || type;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function LeaveManagement() {
  const REQUESTS_PAGE_SIZE = 8;
  const TYPES_PAGE_SIZE = 6;
  const toast = useToast();
  const location = useLocation();
  const activeTab = getTabFromSearch(location.search);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewComment, setReviewComment] = useState('');
  const [showLeaveTypeForm, setShowLeaveTypeForm] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [leaveTypeForm, setLeaveTypeForm] = useState(initialLeaveTypeForm);
  const [requestPage, setRequestPage] = useState(1);
  const [typePage, setTypePage] = useState(1);

  const fetchPageData = async () => {
    setLoading(true);
    try {
      const [requestData, leaveTypeData] = await Promise.all([
        leaveRequestAPI.getAllForAdmin(),
        optionsAPI.getAllLeaveTypes(),
      ]);
      setLeaveRequests(requestData);
      setLeaveTypes(leaveTypeData);
    } catch (error) {
      toast.error(`Failed to load leave data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((request) => {
      const matchesSearch =
        request.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.leave_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leaveRequests, searchTerm, statusFilter]);

  useEffect(() => {
    setRequestPage(1);
  }, [searchTerm, statusFilter, leaveRequests.length]);

  useEffect(() => {
    setTypePage(1);
  }, [leaveTypes.length]);

  const totalRequestPages = Math.max(1, Math.ceil(filteredRequests.length / REQUESTS_PAGE_SIZE));
  const paginatedRequests = filteredRequests.slice(
    (requestPage - 1) * REQUESTS_PAGE_SIZE,
    requestPage * REQUESTS_PAGE_SIZE
  );

  const totalTypePages = Math.max(1, Math.ceil(leaveTypes.length / TYPES_PAGE_SIZE));
  const paginatedLeaveTypes = leaveTypes.slice(
    (typePage - 1) * TYPES_PAGE_SIZE,
    typePage * TYPES_PAGE_SIZE
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const handleStatusUpdate = async (requestId, status, comment = '') => {
    try {
      await leaveRequestAPI.updateStatus(requestId, status, comment);
      await fetchPageData();
      toast.success(`Leave request ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to update leave request: ${error.message}`);
    }
  };

  const openCreateLeaveType = () => {
    setEditingLeaveType(null);
    setLeaveTypeForm(initialLeaveTypeForm);
    setShowLeaveTypeForm(true);
  };

  const openEditLeaveType = (leaveType) => {
    setEditingLeaveType(leaveType);
    setLeaveTypeForm({
      name: leaveType.name,
      description: leaveType.description || '',
      max_days_per_year: leaveType.max_days_per_year,
      carry_forward_enabled: leaveType.carry_forward_enabled,
      max_carry_forward_days: leaveType.max_carry_forward_days,
    });
    setShowLeaveTypeForm(true);
  };

  const closeLeaveTypeForm = () => {
    setEditingLeaveType(null);
    setLeaveTypeForm(initialLeaveTypeForm);
    setShowLeaveTypeForm(false);
  };

  const handleLeaveTypeSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...leaveTypeForm,
      max_days_per_year: Number(leaveTypeForm.max_days_per_year),
      max_carry_forward_days: leaveTypeForm.carry_forward_enabled
        ? Number(leaveTypeForm.max_carry_forward_days)
        : 0,
    };

    try {
      if (editingLeaveType) {
        await optionsAPI.updateLeaveType(editingLeaveType.id, payload);
        toast.success(`Leave type "${payload.name}" updated successfully`);
      } else {
        await optionsAPI.createLeaveType(payload);
        toast.success(`Leave type "${payload.name}" added successfully`);
      }
      closeLeaveTypeForm();
      await fetchPageData();
    } catch (error) {
      toast.error(`Failed to save leave type: ${error.message}`);
    }
  };

  const handleToggleLeaveTypeStatus = async (leaveType) => {
    try {
      await optionsAPI.updateLeaveType(leaveType.id, {
        is_active: !leaveType.is_active,
      });
      toast.success(
        `Leave type "${leaveType.name}" marked ${leaveType.is_active ? 'inactive' : 'active'}`
      );
      await fetchPageData();
    } catch (error) {
      toast.error(`Failed to update leave type status: ${error.message}`);
    }
  };

  const handleDeleteLeaveType = async (leaveType) => {
    try {
      await optionsAPI.deleteLeaveType(leaveType.id);
      toast.success(`Leave type "${leaveType.name}" deleted successfully`);
      await fetchPageData();
    } catch (error) {
      toast.error(`Failed to delete leave type: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4 sm:p-5 lg:p-6">
      {activeTab === 'requests' && (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-60"
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-48"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              New Application
            </button>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'types' && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Leave Type Catalog</p>
              <p className="mt-1 text-sm text-slate-500">
                Manage active, inactive, update, and delete actions for leave policies.
              </p>
            </div>
            <button
              onClick={openCreateLeaveType}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Leave Type
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Requests" value={leaveRequests.length} icon={<FiFileText className="w-6 h-6 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard label="Pending" value={leaveRequests.filter((r) => r.status === 'Pending').length} icon={<FiCalendar className="w-6 h-6 text-yellow-600" />} iconBg="bg-yellow-100" valueClass="text-yellow-600" />
        <StatCard label="Approved" value={leaveRequests.filter((r) => r.status === 'Approved').length} icon={<FiCheck className="w-6 h-6 text-green-600" />} iconBg="bg-green-100" valueClass="text-green-600" />
        <StatCard label="Leave Types" value={leaveTypes.length} icon={<FiFileText className="w-6 h-6 text-slate-600" />} iconBg="bg-slate-100" valueClass="text-slate-700" />
      </div>

      {activeTab === 'requests' && (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Leave Requests</h2>
        </div>
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.employee_name}</div>
                          <div className="text-sm text-gray-500">ID: {request.employee_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLeaveTypeLabel(request.leave_type)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(request.from_date)} - {formatDate(request.to_date)}</div>
                      <div className="text-sm text-gray-500">{calculateDuration(request.from_date, request.to_date)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{request.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(request.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setReviewComment(request.admin_comment || '');
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {request.status === 'Pending' && (
                          <>
                            <button onClick={() => handleStatusUpdate(request.id, 'Approved')} className="text-green-600 hover:text-green-900" title="Approve">
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleStatusUpdate(request.id, 'Rejected')} className="text-red-600 hover:text-red-900" title="Reject">
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredRequests.length > 0 && (
          <Pagination
            currentPage={requestPage}
            totalPages={totalRequestPages}
            onPageChange={setRequestPage}
            totalItems={filteredRequests.length}
            pageSize={REQUESTS_PAGE_SIZE}
            itemLabel="leave requests"
          />
        )}
      </section>
      )}

      {activeTab === 'types' && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Leave Type List</h2>
          </div>
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carry Forward</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLeaveTypes.map((leaveType) => (
                <tr key={leaveType.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{leaveType.name}</div>
                    <div className="text-sm text-gray-500">{leaveType.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4">{leaveType.max_days_per_year}</td>
                  <td className="px-6 py-4">
                    {leaveType.carry_forward_enabled
                      ? `${leaveType.max_carry_forward_days} days max`
                      : 'Not allowed'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${leaveType.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                      {leaveType.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm">
                      <button onClick={() => openEditLeaveType(leaveType)} className="text-blue-600 hover:text-blue-800" title="Edit">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleLeaveTypeStatus(leaveType)}
                        className={leaveType.is_active ? 'text-amber-600 hover:text-amber-800' : 'text-green-600 hover:text-green-800'}
                        title={leaveType.is_active ? 'Mark Inactive' : 'Mark Active'}
                      >
                        {leaveType.is_active ? 'Inactive' : 'Active'}
                      </button>
                      <button onClick={() => handleDeleteLeaveType(leaveType)} className="text-red-600 hover:text-red-800" title="Delete">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaveTypes.length > 0 && (
          <Pagination
            currentPage={typePage}
            totalPages={totalTypePages}
            onPageChange={setTypePage}
            totalItems={leaveTypes.length}
            pageSize={TYPES_PAGE_SIZE}
            itemLabel="leave types"
          />
        )}
      </section>
      )}

      {showApplicationForm && (
        <LeaveApplicationForm
          onClose={() => setShowApplicationForm(false)}
          onSuccess={fetchPageData}
        />
      )}

      {showLeaveTypeForm &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingLeaveType ? 'Update Leave Type' : 'Add Leave Type'}
                </h2>
                <button onClick={closeLeaveTypeForm} className="rounded-full p-2 transition-colors hover:bg-slate-200/70">
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleLeaveTypeSubmit} className="space-y-4 px-5 py-4">
                <input
                  type="text"
                  value={leaveTypeForm.name}
                  onChange={(event) => setLeaveTypeForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Leave type name"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                  required
                />
                <textarea
                  value={leaveTypeForm.description}
                  onChange={(event) => setLeaveTypeForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Description"
                  className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5"
                  rows={3}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="number"
                    min="0"
                    value={leaveTypeForm.max_days_per_year}
                    onChange={(event) => setLeaveTypeForm((prev) => ({ ...prev, max_days_per_year: event.target.value }))}
                    placeholder="Max days per year"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    value={leaveTypeForm.max_carry_forward_days}
                    onChange={(event) => setLeaveTypeForm((prev) => ({ ...prev, max_carry_forward_days: event.target.value }))}
                    placeholder="Max carry forward days"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                    disabled={!leaveTypeForm.carry_forward_enabled}
                  />
                </div>
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={leaveTypeForm.carry_forward_enabled}
                    onChange={(event) =>
                      setLeaveTypeForm((prev) => ({
                        ...prev,
                        carry_forward_enabled: event.target.checked,
                        max_carry_forward_days: event.target.checked ? prev.max_carry_forward_days : 0,
                      }))
                    }
                  />
                  Allow carry forward
                </label>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeLeaveTypeForm} className="rounded-xl bg-slate-100 px-4 py-2.5 text-slate-700 hover:bg-slate-200">
                    Cancel
                  </button>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700">
                  {editingLeaveType ? 'Update Leave Type' : 'Save Leave Type'}
                </button>
              </div>
            </form>
          </div>
          </div>,
          document.body
        )}

      {showDetailsModal &&
        selectedRequest &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                <h2 className="text-xl font-semibold text-slate-900">Leave Request Details</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRequest(null);
                    setReviewComment('');
                  }}
                  className="rounded-full p-2 transition-colors hover:bg-slate-200/70"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-5 px-5 py-4">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">Employee Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Name</p>
                      <p className="font-medium">{selectedRequest.employee_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Employee ID</p>
                      <p className="font-medium">{selectedRequest.employee_id}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">Leave Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Leave Type</p>
                      <p className="font-medium">{getLeaveTypeLabel(selectedRequest.leave_type)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Duration</p>
                      <p className="font-medium">
                        {formatDate(selectedRequest.from_date)} - {formatDate(selectedRequest.to_date)}
                        <span className="ml-2 text-sm text-slate-500">
                          ({calculateDuration(selectedRequest.from_date, selectedRequest.to_date)})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">Reason for Leave</h3>
                  <p className="rounded-xl bg-slate-50 p-4 text-slate-700">{selectedRequest.reason}</p>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900">Status</h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>

                {selectedRequest.admin_comment && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-slate-900">Admin Comment</h3>
                    <p className="rounded-xl bg-slate-50 p-4 text-slate-700">{selectedRequest.admin_comment}</p>
                  </div>
                )}

                {selectedRequest.status === 'Pending' && (
                  <div className="space-y-4 border-t border-slate-200 pt-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Review Comment</label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={3}
                        placeholder="Add a review comment for the employee..."
                        className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={async () => {
                          await handleStatusUpdate(selectedRequest.id, 'Rejected', reviewComment);
                          setShowDetailsModal(false);
                          setSelectedRequest(null);
                          setReviewComment('');
                        }}
                        className="rounded-xl border border-red-300 px-4 py-2.5 text-red-600 transition-colors hover:bg-red-50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={async () => {
                          await handleStatusUpdate(selectedRequest.id, 'Approved', reviewComment);
                          setShowDetailsModal(false);
                          setSelectedRequest(null);
                          setReviewComment('');
                        }}
                        className="rounded-xl bg-green-600 px-4 py-2.5 text-white transition-colors hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          ,
          document.body
        )}
    </div>
  );
}

function StatCard({ label, value, icon, iconBg, valueClass = 'text-gray-800' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
        </div>
        <div className={`${iconBg} p-3 rounded-full`}>{icon}</div>
      </div>
    </div>
  );
}

function getTabFromSearch(search) {
  const params = new URLSearchParams(search);
  return params.get('tab') === 'types' ? 'types' : 'requests';
}
