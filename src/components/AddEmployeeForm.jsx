import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiBriefcase, FiCalendar, FiCheckCircle, FiLock, FiMail, FiPhone, FiUser, FiUserPlus, FiX } from "react-icons/fi";
import { optionsAPI } from "../services/api";
import { useToast } from "../contexts/ToastContext";

const defaultFormData = {
  name: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  joining_date: "",
  status: "Active",
  username: "",
  password: "",
};

export default function AddEmployeeForm({ isOpen, onClose, onSubmit, initialData = null }) {
  const toast = useToast();
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");

  const isEditMode = Boolean(initialData);
  const statuses = ["Active", "Inactive"];

  const loadDepartments = async () => {
    try {
      const data = await optionsAPI.getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Failed to load departments:", error);
      toast.error(`Failed to load departments: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    loadDepartments();

    setFormData({
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      department: initialData?.department || "",
      position: initialData?.position || "",
      joining_date: initialData?.joining_date || "",
      status: initialData?.status || "Active",
      username: "",
      password: "",
    });
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    }

    if (!formData.department) {
      nextErrors.department = "Department is required";
    }

    if (!formData.position.trim()) {
      nextErrors.position = "Position is required";
    }

    if (!isEditMode && !formData.username.trim()) {
      nextErrors.username = "Username is required";
    }

    if (!isEditMode && !formData.password.trim()) {
      nextErrors.password = "Temporary password is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        department: formData.department,
        position: formData.position,
        joining_date: formData.joining_date || null,
        status: formData.status,
      };

      if (!isEditMode) {
        payload.username = formData.username;
        payload.password = formData.password;
      }

      if (isEditMode && formData.username.trim()) {
        payload.username = formData.username;
      }

      if (isEditMode && formData.password.trim()) {
        payload.password = formData.password;
      }

      await onSubmit(payload);
      onClose();
      setFormData(defaultFormData);
    } catch (error) {
      console.error("Employee form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      const createdDepartment = await optionsAPI.createDepartment({
        name: newDepartment,
      });
      await loadDepartments();
      setFormData((prev) => ({
        ...prev,
        department: createdDepartment.name,
      }));
      setNewDepartment("");
      setShowAddDepartment(false);
      toast.success(`Department "${createdDepartment.name}" added successfully`);
    } catch (error) {
      toast.error(`Failed to add department: ${error.message}`);
    }
  };

  if (!isOpen) {
    return null;
  }

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}>
        <div className="pointer-events-none absolute -left-40 -top-32 h-96 w-96 rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-emerald-400/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-indigo-400/8 blur-3xl" />
      </div>

      <div
        className="relative z-[101] flex max-h-[calc(100vh-1.25rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_26px_80px_rgba(15,23,42,0.24)] ring-1 ring-slate-200 sm:max-h-[calc(100vh-1.5rem)]"
        onClick={(event) => event.stopPropagation()}
      >
          <div className="border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-emerald-50 px-4 py-4 sm:px-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Employee Account
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                  {isEditMode ? "Edit Employee" : "Add New Employee"}
                </h2>
                <p className="mt-1 max-w-xl text-sm text-slate-500">
                  {isEditMode
                    ? "Update employee basics and optionally reset their login."
                    : "Create the employee account now. They can complete their profile after login."}
                </p>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-4 sm:px-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  icon={<FiUser className="inline mr-2" />}
                  label="Full Name"
                  error={errors.name}
                >
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter employee name"
                    className={inputClass(errors.name)}
                  />
                </Field>

                <Field
                  icon={<FiMail className="inline mr-2" />}
                  label="Email"
                  error={errors.email}
                >
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={inputClass(errors.email)}
                  />
                </Field>

                <Field
                  icon={<FiBriefcase className="inline mr-2" />}
                  label="Department"
                  error={errors.department}
                >
                  <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={inputClass(errors.department)}
                    >
                      <option value="">Select Department</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.name}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddDepartment((prev) => !prev)}
                      className="text-left text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                      + Add Department
                    </button>
                    {showAddDepartment && (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
                        <input
                          type="text"
                          value={newDepartment}
                          onChange={(event) => setNewDepartment(event.target.value)}
                          placeholder="New department name"
                          className={inputClass(false)}
                        />
                        <button
                          type="button"
                          onClick={handleAddDepartment}
                          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                </Field>

                <Field
                  icon={<FiBriefcase className="inline mr-2" />}
                  label="Position"
                  error={errors.position}
                >
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Enter job position"
                    className={inputClass(errors.position)}
                  />
                </Field>

                <Field
                  icon={<FiPhone className="inline mr-2" />}
                  label="Phone"
                  error={errors.phone}
                >
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={inputClass(errors.phone)}
                  />
                </Field>

                <Field
                  icon={<FiCalendar className="inline mr-2" />}
                  label="Joining Date"
                  error={errors.joining_date}
                >
                  <input
                    type="date"
                    name="joining_date"
                    value={formData.joining_date}
                    onChange={handleChange}
                    className={inputClass(errors.joining_date)}
                  />
                </Field>

                <Field
                  icon={<FiCheckCircle className="inline mr-2" />}
                  label="Status"
                  error={errors.status}
                >
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass(errors.status)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  icon={<FiUserPlus className="inline mr-2" />}
                  label={isEditMode ? "Username Reset" : "Login Username"}
                  error={errors.username}
                >
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder={isEditMode ? "Optional new username" : "Create a username"}
                    className={inputClass(errors.username)}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field
                    icon={<FiLock className="inline mr-2" />}
                    label={isEditMode ? "Password Reset" : "Temporary Password"}
                    error={errors.password}
                  >
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={isEditMode ? "Optional new password" : "Create a temporary password"}
                      className={inputClass(errors.password)}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Employee" : "Create Employee")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  );

  return createPortal(modal, document.body);
}

function Field({ label, icon, error, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {icon}
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-xl border bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
    hasError ? "border-red-500" : "border-gray-300"
  }`;
}
