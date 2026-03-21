import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiFileText, FiSend, FiX } from 'react-icons/fi';

const LeaveApplicationForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    employee_name: '',
    leave_type: 'Casual',
    from_date: '',
    to_date: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Fetch employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8000/employees/');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const leaveTypes = [
    { value: 'Casual', label: 'Casual Leave' },
    { value: 'Sick', label: 'Sick Leave' },
    { value: 'Annual', label: 'Annual Leave' },
    { value: 'Maternity', label: 'Maternity Leave' },
    { value: 'Paternity', label: 'Paternity Leave' },
    { value: 'Emergency', label: 'Emergency Leave' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Please select an employee';
    }

    if (!formData.employee_name.trim()) {
      newErrors.employee_name = 'Employee name is required';
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
      const selectedEmployee = employees.find(emp => emp.id === parseInt(value));
      setFormData({
        ...formData,
        [name]: value,
        employee_name: selectedEmployee ? selectedEmployee.name : ''
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
      const response = await fetch('http://localhost:8000/leave-requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          employee_id: formData.employee_id,
          from_date: new Date(formData.from_date).toISOString(),
          to_date: new Date(formData.to_date).toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to submit leave request');
      }

      const data = await response.json();
      
      // Reset form
      setFormData({
        employee_id: '',
        employee_name: '',
        leave_type: 'casual',
        from_date: '',
        to_date: '',
        reason: ''
      });

      // Show success message
      alert('Leave Request Submitted successfully!');
      
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
      alert(`Failed to submit leave request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Leave Application Form</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline w-4 h-4 mr-1" />
                Employee *
              </label>
              <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employee_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.department}
                  </option>
                ))}
              </select>
              {errors.employee_id && (
                <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Name *
              </label>
              <input
                type="text"
                name="employee_name"
                value={formData.employee_name}
                onChange={handleInputChange}
                placeholder="Employee name will be auto-filled"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${
                  errors.employee_name ? 'border-red-500' : 'border-gray-300'
                }`}
                readOnly
              />
              {errors.employee_name && (
                <p className="mt-1 text-sm text-red-600">{errors.employee_name}</p>
              )}
            </div>
          </div>

          {/* Leave Type and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="inline w-4 h-4 mr-1" />
                Leave Type *
              </label>
              <select
                name="leave_type"
                value={formData.leave_type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.leave_type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {leaveTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.leave_type && (
                <p className="mt-1 text-sm text-red-600">{errors.leave_type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline w-4 h-4 mr-1" />
                From Date *
              </label>
              <input
                type="date"
                name="from_date"
                value={formData.from_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.from_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.from_date && (
                <p className="mt-1 text-sm text-red-600">{errors.from_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline w-4 h-4 mr-1" />
                To Date *
              </label>
              <input
                type="date"
                name="to_date"
                value={formData.to_date}
                onChange={handleInputChange}
                min={formData.from_date || new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.to_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.to_date && (
                <p className="mt-1 text-sm text-red-600">{errors.to_date}</p>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiFileText className="inline w-4 h-4 mr-1" />
              Reason for Leave *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Please provide a detailed reason for your leave request (minimum 10 characters)..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.reason.length}/1000 characters
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;
