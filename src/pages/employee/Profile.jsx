import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiEdit3,
  FiMapPin,
  FiMail,
  FiPhone,
  FiSave,
  FiUser,
  FiX,
} from "react-icons/fi";
import { employeeAPI, handleApiError } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  date_of_birth: "",
  joining_date: "",
  address: "",
  emergency_contact: "",
  status: "",
};

export default function Profile() {
  const { user, login } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await employeeAPI.getMe();
        setProfile(data);
        setDraft(data);
      } catch (requestError) {
        setError(handleApiError(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDraft((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      const updatedProfile = await employeeAPI.updateMe({
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
        date_of_birth: draft.date_of_birth || null,
        address: draft.address,
        emergency_contact: draft.emergency_contact,
      });
      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setIsEditing(false);
      if (user) {
        login({
          ...user,
          email: updatedProfile.email,
          full_name: updatedProfile.name,
        });
      }
      toast.success("Profile updated successfully!");
    } catch (requestError) {
      setError(handleApiError(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
    setError("");
  };

  const userName = draft.name || user?.full_name || user?.name || user?.username || "Employee";
  const companyLabel = user?.company_name || user?.tenant_slug || "Company";

  if (loading) {
    return (
      <div className="space-y-5 p-2 sm:p-3 lg:p-4">
        <div className="rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="flex min-h-[420px] items-center justify-center px-6 py-16 text-slate-500">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-2 sm:p-3 lg:p-4">
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_50%,#ecfeff_100%)] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 aspect-square items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/15 ring-4 ring-white">
                <FiUser className="h-9 w-9" />
              </div>
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                  <FiUser className="h-3.5 w-3.5" />
                  Employee Profile
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{userName}</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Keep your personal details up to date and manage your account information.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[560px]">
              <MiniStat label="Department" value={profile.department || "-"} />
              <MiniStat label="Position" value={profile.position || "-"} />
              <MiniStat label="Status" value={profile.status || "-"} />
              <MiniStat label="Company" value={companyLabel} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
          <section className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Profile Details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Edit the fields you can change. Department and position are managed by admin.
                </p>
              </div>
              {isEditing ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                  <FiEdit3 className="h-3.5 w-3.5" />
                  Editing
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  <FiCheckCircle className="h-3.5 w-3.5" />
                  Up to date
                </span>
              )}
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ProfileField
                  icon={<FiUser className="h-4 w-4" />}
                  label="Full Name"
                  name="name"
                  value={draft.name}
                  editable={isEditing}
                  onChange={handleChange}
                />
                <ProfileField
                  icon={<FiMail className="h-4 w-4" />}
                  label="Email"
                  name="email"
                  type="email"
                  value={draft.email}
                  editable={isEditing}
                  onChange={handleChange}
                />
                <ProfileField
                  icon={<FiBriefcase className="h-4 w-4" />}
                  label="Department"
                  name="department"
                  value={profile.department}
                  editable={false}
                />
                <ProfileField
                  icon={<FiBriefcase className="h-4 w-4" />}
                  label="Position"
                  name="position"
                  value={profile.position}
                  editable={false}
                />
                <ProfileField
                  icon={<FiPhone className="h-4 w-4" />}
                  label="Phone"
                  name="phone"
                  value={draft.phone}
                  editable={isEditing}
                  onChange={handleChange}
                />
                <ProfileField
                  icon={<FiCalendar className="h-4 w-4" />}
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={draft.date_of_birth}
                  editable={isEditing}
                  onChange={handleChange}
                />
                <ProfileField
                  icon={<FiCalendar className="h-4 w-4" />}
                  label="Joining Date"
                  name="joining_date"
                  type="date"
                  value={profile.joining_date}
                  editable={false}
                />
                <ProfileField
                  icon={<FiPhone className="h-4 w-4" />}
                  label="Emergency Contact"
                  name="emergency_contact"
                  value={draft.emergency_contact}
                  editable={isEditing}
                  onChange={handleChange}
                />

                <div className="md:col-span-2">
                  <ProfileField
                    icon={<FiMapPin className="h-4 w-4" />}
                    label="Address"
                    name="address"
                    value={draft.address}
                    editable={isEditing}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      <FiSave className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <FiX className="h-4 w-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <FiEdit3 className="h-4 w-4" />
                    Complete / Edit Profile
                  </button>
                )}
              </div>
            </div>
          </section>

          <aside className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-6 xl:border-l xl:border-t-0">
            <h2 className="text-lg font-semibold text-slate-900">Account Summary</h2>
            <p className="mt-1 text-sm text-slate-500">Quick details about your login and employment record.</p>

            <div className="mt-5 space-y-3">
              <SummaryRow label="Username" value={user?.username || "-"} />
              <SummaryRow label="Account Status" value={profile.status || "-"} />
              <SummaryRow label="Joining Date" value={profile.joining_date || "-"} />
              <SummaryRow label="Employee Type" value="Employee" />
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
              Keep your contact details current so HR can reach you quickly for attendance, leave, and payroll updates.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, name, value, editable, onChange, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <span className="text-slate-400">{icon}</span>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={!editable}
        className={`w-full rounded-xl border px-4 py-2.5 text-slate-900 outline-none transition ${
          editable
            ? "border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            : "border-slate-200 bg-slate-50 text-slate-700"
        }`}
      />
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
