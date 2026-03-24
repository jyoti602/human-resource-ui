import { useState, useEffect } from "react";
import AddEmployeeForm from "../../components/AddEmployeeForm";
import Pagination from "../../components/Pagination";
import { employeeAPI, handleApiError } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

export default function Employees() {
  const PAGE_SIZE = 8;
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error('Failed to fetch employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
                         emp.email.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All" ||
      emp.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, departmentFilter, employees.length]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      await employeeAPI.create(employeeData);
      await fetchEmployees();
      toast.success(
        `Employee "${employeeData.name}" has been added.\nUsername: ${employeeData.username}\nTemporary Password: ${employeeData.password}`
      );
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to add employee: ${errorMessage}`);
      throw error;
    }
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      await employeeAPI.update(editingEmployee.id, employeeData);
      await fetchEmployees();
      toast.success(`Employee "${employeeData.name}" has been updated successfully!`);
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(`Failed to update employee: ${errorMessage}`);
      throw error;
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      try {
        await employeeAPI.delete(employee.id);
        await fetchEmployees(); // Refresh the list
        toast.success(`Employee "${employee.name}" has been deleted!`);
      } catch (error) {
        const errorMessage = handleApiError(error);
        toast.error(`Failed to delete employee: ${errorMessage}`);
      }
    }
  };

  const openAddForm = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  // Extract unique departments for filter
  const departments = [...new Set(employees.map(emp => emp.department))].filter(Boolean);

  return (
    <div className="space-y-6 p-3 sm:p-4 lg:p-5">
      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center self-start rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 lg:self-auto"
          >
            + Add Employee
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchEmployees}
            className="ml-4 font-medium text-red-600 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && (
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
          <p className="mt-3 text-slate-600">Loading employees...</p>
        </div>
      )}

      {!isLoading && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.length > 0 ? (
                  paginatedEmployees.map((emp) => (
                    <tr key={emp.id} className="align-top transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-700">{emp.id}</td>
                      <td className="px-6 py-5 text-base font-medium text-slate-900">{emp.name}</td>
                      <td className="px-6 py-5 text-sm text-slate-600">{emp.email}</td>
                      <td className="px-6 py-5 text-sm text-slate-700">{emp.department}</td>
                      <td className="px-6 py-5 text-sm text-slate-700">{emp.position}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                            emp.status
                          )}`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-3 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditEmployee(emp)}
                            className="text-blue-600 transition hover:text-blue-700 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp)}
                            className="text-red-600 transition hover:text-red-700 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-slate-500"
                    >
                      {employees.length === 0
                        ? "No employees found. Add your first employee!"
                        : "No employees match your search criteria."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && filteredEmployees.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredEmployees.length}
            pageSize={PAGE_SIZE}
            itemLabel="employees"
          />
        </div>
      )}

      {/* Add/Edit Employee Form Modal */}
      <AddEmployeeForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
        initialData={editingEmployee}
      />
    </div>
  );
}
