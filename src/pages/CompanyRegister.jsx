import { useState } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import Topbar from "../components/Topbar";
import { useToast } from "../contexts/ToastContext";
import { companyAPI } from "../services/api";

const initialForm = {
  company_name: "",
  company_slug: "",
  company_email: "",
  company_address: "",
  company_phone: "",
  admin_full_name: "",
  admin_email: "",
  admin_username: "",
  password: "",
  confirm_password: "",
};

const buildTenantLoginUrl = (companySlug) => {
  if (typeof window === "undefined") {
    return `/login`;
  }

  const { protocol, port, hostname } = window.location;
  const baseHost = hostname === "localhost" ? "localhost" : hostname.replace(/^[^.]+\./, "");
  const tenantHost = `${companySlug}.${baseHost}`;
  const portPart = port ? `:${port}` : "";

  return `${protocol}//${tenantHost}${portPart}/login`;
};

export default function CompanyRegister() {
  const toast = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [createdWorkspace, setCreatedWorkspace] = useState(null);
  const tenantLoginUrl = createdWorkspace ? buildTenantLoginUrl(createdWorkspace.company_slug) : "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCompanyNameBlur = () => {
    if (formData.company_slug.trim()) {
      return;
    }

    const suggestedSlug = formData.company_name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setFormData((current) => ({
      ...current,
      company_slug: suggestedSlug,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Password and confirm password must match");
      return;
    }

    setSubmitting(true);
    try {
      const response = await companyAPI.register({
        company_name: formData.company_name,
        company_slug: formData.company_slug,
        company_email: formData.company_email,
        company_address: formData.company_address || null,
        company_phone: formData.company_phone || null,
        admin_full_name: formData.admin_full_name,
        admin_email: formData.admin_email,
        admin_username: formData.admin_username,
        password: formData.password,
      });

      setCreatedWorkspace(response);
      toast.success("Company workspace created successfully");
      setFormData(initialForm);
    } catch (error) {
      toast.error(`Failed to create company: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f3ee] text-slate-900">
      <Topbar />

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.22),_transparent_35%),linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#166534_100%)] px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
            Multi-Company HRMS
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Create a workspace for your company and start onboarding your team.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
            Register your company, create the first admin account, and get a ready-to-configure HR workspace with departments and leave policies seeded for you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Company Registration</h2>
            <p className="mt-2 text-sm text-slate-500">
              This will create your company workspace and the first admin login.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Company Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Company Name">
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    onBlur={handleCompanyNameBlur}
                    className={inputClass}
                    placeholder="Acme Technologies"
                    required
                  />
                </FormField>

                <FormField label="Company Slug">
                  <input
                    type="text"
                    name="company_slug"
                    value={formData.company_slug}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="acme-technologies"
                    required
                  />
                </FormField>

                <FormField label="Company Email">
                  <input
                    type="email"
                    name="company_email"
                    value={formData.company_email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="hello@acme.com"
                    required
                  />
                </FormField>

                <FormField label="Company Address">
                  <input
                    type="text"
                    name="company_address"
                    value={formData.company_address}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="123 Business Park, New Delhi"
                  />
                </FormField>

                <FormField label="Phone">
                  <input
                    type="text"
                    name="company_phone"
                    value={formData.company_phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="+91 9876543210"
                  />
                </FormField>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Admin Account</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Admin Full Name">
                  <input
                    type="text"
                    name="admin_full_name"
                    value={formData.admin_full_name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Aarav Sharma"
                    required
                  />
                </FormField>

                <FormField label="Admin Email">
                  <input
                    type="email"
                    name="admin_email"
                    value={formData.admin_email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="admin@acme.com"
                    required
                  />
                </FormField>

                <FormField label="Admin Username">
                  <input
                    type="text"
                    name="admin_username"
                    value={formData.admin_username}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="acme_admin"
                    required
                  />
                </FormField>

                <FormField label="Password">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Create a strong password"
                    required
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Confirm Password">
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Re-enter password"
                      required
                    />
                  </FormField>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Already created a workspace?{" "}
                <a href="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                  Sign in
                </a>
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creating Workspace..." : "Create Company Workspace"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] bg-[#132238] p-8 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
            <h3 className="text-xl font-semibold">What gets created automatically?</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-200">
              <li>Company workspace with your unique slug</li>
              <li>First admin account for setup and onboarding</li>
              <li>Default departments for quick employee creation</li>
              <li>Default leave types and carry-forward rules</li>
            </ul>
          </div>

          {createdWorkspace ? (
            <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Workspace Ready
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">{createdWorkspace.company_name}</h3>
              <div className="mt-5 space-y-2 text-sm text-slate-700">
                <p>Slug: <span className="font-semibold">{createdWorkspace.company_slug}</span></p>
                {createdWorkspace.company_address && (
                  <p>Address: <span className="font-semibold">{createdWorkspace.company_address}</span></p>
                )}
                <p>Admin Username: <span className="font-semibold">{createdWorkspace.admin_username}</span></p>
                <p>Company ID: <span className="font-semibold">{createdWorkspace.company_id}</span></p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = tenantLoginUrl;
                  }}
                  className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Go To Login
                </button>
                <a
                  href={tenantLoginUrl}
                  className="rounded-xl border border-emerald-300 px-5 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-100"
                >
                  Open Company Workspace
                </a>
              </div>
              <p className="mt-4 break-all text-sm text-slate-600">
                Workspace URL: <span className="font-semibold">{tenantLoginUrl}</span>
              </p>
            </div>
          ) : (
            <div className="rounded-[28px] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <h3 className="text-xl font-semibold text-slate-900">Next step after registration</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Sign in as the company admin and continue with setup: departments, leave types, attendance rules, and your first employees.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30";
