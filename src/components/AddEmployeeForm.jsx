import { useEffect, useState } from "react";
import { FiBriefcase, FiCalendar, FiCheckCircle, FiLock, FiMail, FiPhone, FiUser, FiUserPlus, FiX } from "react-icons/fi";

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
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(initialData);
  const departments = ["IT", "HR", "Finance", "Marketing", "Sales", "Operations"];
  const statuses = ["Active", "Inactive"];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

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

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditMode ? "Edit Employee" : "Add New Employee"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {isEditMode
                  ? "Update employee basics and optionally reset their login."
                  : "Create the employee account now. They can complete their profile after login."}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
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
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={inputClass(errors.department)}
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
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
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isEditMode ? "Optional new password" : "Create a temporary password"}
                  className={inputClass(errors.password)}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 md:col-span-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Employee" : "Create Employee")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {icon}
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
    hasError ? "border-red-500" : "border-gray-300"
  }`;
}
