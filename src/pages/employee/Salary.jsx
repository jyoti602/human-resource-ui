import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";

export default function Salary() {
  const toast = useToast();
  const [month, setMonth] = useState("March 2026");

  const salaryData = {
    basic: 25000,
    hra: 5000,
    allowances: 3000,
    bonus: 2000,
    tax: 3000,
    pf: 1500,
  };

  const totalEarnings =
    salaryData.basic +
    salaryData.hra +
    salaryData.allowances +
    salaryData.bonus;

  const totalDeductions = salaryData.tax + salaryData.pf;

  const netSalary = totalEarnings - totalDeductions;

  return (
    <div className="p-6 space-y-8">
      <div>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option>January 2026</option>
          <option>February 2026</option>
          <option>March 2026</option>
          <option>April 2026</option>
        </select>
      </div>

      {/* Salary Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8">

        <h2 className="text-xl font-semibold mb-6">
          Payslip for {month}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Earnings */}
          <div>
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              Earnings
            </h3>

            <div className="space-y-3">
              <SalaryRow label="Basic Salary" amount={salaryData.basic} />
              <SalaryRow label="HRA" amount={salaryData.hra} />
              <SalaryRow label="Allowances" amount={salaryData.allowances} />
              <SalaryRow label="Bonus" amount={salaryData.bonus} />
            </div>

            <div className="mt-4 border-t pt-4 font-semibold">
              Total Earnings: ₹{totalEarnings}
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              Deductions
            </h3>

            <div className="space-y-3">
              <SalaryRow label="Income Tax" amount={salaryData.tax} />
              <SalaryRow label="Provident Fund (PF)" amount={salaryData.pf} />
            </div>

            <div className="mt-4 border-t pt-4 font-semibold">
              Total Deductions: ₹{totalDeductions}
            </div>
          </div>
        </div>

        {/* Net Salary */}
        <div className="mt-8 bg-indigo-50 p-6 rounded-xl text-center">
          <h3 className="text-lg text-gray-600">
            Net Salary
          </h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            ₹{netSalary}
          </p>
        </div>

        {/* Download Button */}
        <div className="mt-8 text-right">
          <button
            onClick={() => toast.success("Payslip downloaded successfully!")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Download Payslip
          </button>
        </div>

      </div>

    </div>
  );
}

/* Reusable Salary Row Component */
function SalaryRow({ label, amount }) {
  return (
    <div className="flex justify-between text-gray-700">
      <span>{label}</span>
      <span>₹{amount}</span>
    </div>
  );
}
