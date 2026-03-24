import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, companyAPI, getTenantSlugFromHost } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const detectedTenantSlug = getTenantSlugFromHost();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    companySlug: detectedTenantSlug,
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCompany = async () => {
      if (!detectedTenantSlug) {
        setCompanyName("");
        return;
      }

      try {
        const company = await companyAPI.getCurrent();
        if (!cancelled) {
          setCompanyName(company.name || "");
        }
      } catch (requestError) {
        if (!cancelled) {
          setCompanyName("");
        }
      }
    };

    loadCompany();

    return () => {
      cancelled = true;
    };
  }, [detectedTenantSlug]);

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

    if (!formData.username || !formData.password || (!detectedTenantSlug && !formData.companySlug)) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData);

      authLogin(response);
      navigate(response.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
    } catch (requestError) {
      console.error("Login error:", requestError);
      const errorMessage = requestError.message || "Login failed";

      if (errorMessage.includes("Tenant context is required")) {
        setError("Open the login page from your company URL or enter a company slug.");
      } else if (errorMessage.includes("Incorrect username or password")) {
        setError("Invalid username or password");
      } else {
        setError(errorMessage || "Login failed. Please try again.");
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
            {companyName ? `Login to ${companyName}` : "Login to Your Account"}
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            {companyName
              ? `Sign in to access the ${companyName} workspace.`
              : "Sign in to access your company HRMS workspace."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {detectedTenantSlug ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Signing in to workspace:{" "}
                <span className="font-semibold">{companyName || detectedTenantSlug}</span>
              </div>
            ) : (
              <div>
                <label htmlFor="companySlug" className="mb-1 block text-sm text-gray-600">
                  Company Slug
                </label>
                <input
                  id="companySlug"
                  type="text"
                  name="companySlug"
                  value={formData.companySlug}
                  onChange={handleChange}
                  placeholder="example: green-field-systems"
                  className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                  autoComplete="organization"
                />
              </div>
            )}

            <div>
              <label htmlFor="username" className="mb-1 block text-sm text-gray-600">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="username"
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
            Employee accounts are created by your company administrator.
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            {detectedTenantSlug
              ? "Your company workspace was detected from the URL."
              : "Use your company slug and assigned username to sign in."}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
