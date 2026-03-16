import { useState, useEffect } from "react";
import AddEmployeeForm from "../../components/AddEmployeeForm";
import { employeeAPI, handleApiError } from "../../services/api";

export default function Employees() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      await employeeAPI.create(employeeData);
      await fetchEmployees(); // Refresh the list
      alert(`Employee "${employeeData.name}" has been added successfully!`);
    } catch (error) {
      const errorMessage = handleApiError(error);
      alert(`Failed to add employee: ${errorMessage}`);
      throw error; // Re-throw to handle in form
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
        alert(`Employee "${employee.name}" has been deleted!`);
      } catch (error) {
        const errorMessage = handleApiError(error);
        alert(`Failed to delete employee: ${errorMessage}`);
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Employee Management
      </h1>

      {/* Search + Filter + Add Button */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

        </div>

        <button 
          onClick={openAddForm}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Add Employee
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchEmployees}
            className="ml-4 text-red-600 underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading employees...</p>
        </div>
      )}

      {/* Employees Table */}
      {!isLoading && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Position</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{emp.id}</td>
                    <td className="px-6 py-4">{emp.name}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">{emp.department}</td>
                    <td className="px-6 py-4">{emp.position}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          emp.status
                        )}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button 
                        onClick={() => handleEditEmployee(emp)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(emp)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500"
                  >
                    {employees.length === 0 ? 
                      "No employees found. Add your first employee!" : 
                      "No employees match your search criteria."
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Employee Form Modal */}
      <AddEmployeeForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleAddEmployee}
        initialData={editingEmployee}
      />
    </div>
  );
}