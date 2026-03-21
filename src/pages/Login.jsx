import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { employeeRegistrationAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await employeeRegistrationAPI.login(formData.email, formData.password);

      authLogin(response);
      navigate(response.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    } catch (requestError) {
      console.error("Login error:", requestError);
      const errorMessage = requestError.message || "Login failed";

      if (errorMessage.includes("Invalid role")) {
        setError(errorMessage);
      } else if (errorMessage.includes("Invalid email or password")) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
            Login to Your Account
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            Sign in to access your HRMS dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-gray-600">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-gray-600">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 py-2 text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Employee records are created by an administrator.
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Contact your HR admin if you need access.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
