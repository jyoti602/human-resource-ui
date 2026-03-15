import { useState } from "react";
import AddEmployeeForm from "../../components/AddEmployeeForm";

export default function Employees() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const employeeData = [
    {
      id: 101,
      name: "Rahul Sharma",
      email: "rahul@company.com",
      department: "IT",
      position: "Frontend Developer",
      status: "Active",
    },
    {
      id: 102,
      name: "Priya Verma",
      email: "priya@company.com",
      department: "HR",
      position: "HR Manager",
      status: "Active",
    },
    {
      id: 103,
      name: "Amit Singh",
      email: "amit@company.com",
      department: "Finance",
      position: "Accountant",
      status: "Inactive",
    },
    {
      id: 104,
      name: "Sneha Kapoor",
      email: "sneha@company.com",
      department: "IT",
      position: "Backend Developer",
      status: "Active",
    },
  ];

  const filteredEmployees = employeeData.filter((emp) => {
    const matchesSearch = emp.name
      .toLowerCase()
      .includes(search.toLowerCase());

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

  const handleAddEmployee = (employeeData) => {
    // Here you would typically make an API call to add the employee
    console.log("Adding employee:", employeeData);
    // For now, just log the data
    alert(`Employee "${employeeData.name}" has been added successfully!`);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
      console.log("Deleting employee:", employee);
      alert(`Employee "${employee.name}" has been deleted!`);
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
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>

        </div>

        <button 
          onClick={openAddForm}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Add Employee
        </button>
      </div>

      {/* Employees Table */}
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
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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