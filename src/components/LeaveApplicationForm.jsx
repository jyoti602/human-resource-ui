import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiCalendar, FiUser, FiFileText, FiSend, FiX } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';
import { employeeAPI, leaveRequestAPI, optionsAPI } from '../services/api';

const LeaveApplicationForm = ({
  onClose,
  onSuccess,
  showEmployeeSelector = true,
  employeeId = '',
  employeeLabel = '',
  title = 'Leave Application Form',
  subtitle = 'Submit a new leave request for approval.',
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    employee_id: employeeId,
    leave_type: 'Casual',
    from_date: '',
    to_date: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  // Fetch employees for dropdown
  useEffect(() => {
    const loadFormOptions = async () => {
      try {
        const leaveTypePromise = optionsAPI.getLeaveTypes();
        const employeePromise = showEmployeeSelector ? employeeAPI.getAll() : Promise.resolve([]);
        const [employeeData, leaveTypeData] = await Promise.all([employeePromise, leaveTypePromise]);
        setEmployees(employeeData);
        setLeaveTypes(leaveTypeData);
        setFormData((prev) => ({
          ...prev,
          employee_id: showEmployeeSelector ? prev.employee_id : employeeId,
          leave_type: leaveTypeData.some((item) => item.name === prev.leave_type)
            ? prev.leave_type
            : (leaveTypeData[0]?.name || ""),
        }));
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to load leave form options');
      }
    };

    loadFormOptions();
  }, [employeeId, showEmployeeSelector]);

  const validateForm = () => {
    const newErrors = {};

    if (showEmployeeSelector && !formData.employee_id) {
      newErrors.employee_id = 'Please select an employee';
    }

    if (!formData.leave_type) {
      newErrors.leave_type = 'Please select leave type';
    }

    if (!formData.from_date) {
      newErrors.from_date = 'From date is required';
    }

    if (!formData.to_date) {
      newErrors.to_date = 'To date is required';
    }

    if (formData.from_date && formData.to_date && new Date(formData.from_date) > new Date(formData.to_date)) {
      newErrors.to_date = 'To date must be after from date';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If employee_id changes, update employee_name
    if (name === 'employee_id') {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await leaveRequestAPI.create({
        employee_id: formData.employee_id,
        leave_type: formData.leave_type,
        from_date: formData.from_date,
        to_date: formData.to_date,
        reason: formData.reason,
      });
      
      // Reset form
      setFormData({
        employee_id: '',
        leave_type: 'Casual',
        from_date: '',
        to_date: '',
        reason: ''
      });

      // Show success message
      toast.success('Leave request submitted successfully!');
      
      // Call success callback
      if (onSuccess) {
        onSuccess(data);
      }

      // Close form
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error(`Failed to submit leave request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950/35 px-3 py-4 backdrop-blur-sm">
      <div className="pointer-events-none absolute -left-32 -top-28 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-1/4 h-[24rem] w-[24rem] rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[22rem] w-[22rem] rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] ring-1 ring-slate-200">
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">
              <FiSend className="h-3.5 w-3.5" />
              Leave Request
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close leave application form"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto bg-white px-4 py-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <div className={`grid grid-cols-1 gap-4 ${showEmployeeSelector ? "md:grid-cols-2" : ""}`}>
              {showEmployeeSelector && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    <FiUser className="mr-1 inline h-4 w-4" />
                    Employee *
                  </label>
                  <select
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 ${
                      errors.employee_id ? 'border-red-500' : 'border-slate-300'
                    }`}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </option>
                    ))}
                  </select>
                  {errors.employee_id && <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  <FiFileText className="mr-1 inline h-4 w-4" />
                  Leave Type *
                </label>
                <select
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 ${
                    errors.leave_type ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  {leaveTypes.map((type) => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.leave_type && <p className="mt-1 text-sm text-red-600">{errors.leave_type}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  <FiCalendar className="mr-1 inline h-4 w-4" />
                  From Date *
                </label>
                <input
                  type="date"
                  name="from_date"
                  value={formData.from_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 ${
                    errors.from_date ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.from_date && <p className="mt-1 text-sm text-red-600">{errors.from_date}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  <FiCalendar className="mr-1 inline h-4 w-4" />
                  To Date *
                </label>
                <input
                  type="date"
                  name="to_date"
                  value={formData.to_date}
                  onChange={handleInputChange}
                  min={formData.from_date || new Date().toISOString().split('T')[0]}
                  className={`w-full rounded-xl border bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 ${
                    errors.to_date ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.to_date && <p className="mt-1 text-sm text-red-600">{errors.to_date}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              <FiFileText className="mr-1 inline h-4 w-4" />
              Reason for Leave *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Please provide a detailed reason for your leave request (minimum 10 characters)..."
              rows={4}
              className={`w-full resize-none rounded-2xl border bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 ${
                errors.reason ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            <div className="mt-2 flex items-center justify-between text-sm">
              {errors.reason ? (
                <p className="text-red-600">{errors.reason}</p>
              ) : (
                <p className="text-slate-500">Write a clear reason so the manager can review it quickly.</p>
              )}
              <p className="text-slate-400">{formData.reason.length}/1000</p>
            </div>
          </div>

          <div className="sticky bottom-0 mt-auto flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 py-4 backdrop-blur-sm sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default LeaveApplicationForm;
