import {
  FiBriefcase,
  FiCalendar,
  FiHash,
  FiLogOut,
  FiMail,
  FiShield,
  FiUser,
  FiUserCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.full_name || user?.name || user?.username || "Admin";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-5 p-2 sm:p-3 lg:p-4">
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="bg-[linear-gradient(135deg,#f8fafc_0%,#eff6ff_45%,#ecfeff_100%)] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 aspect-square items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/15 ring-4 ring-white">
                <FiUserCheck className="h-9 w-9" />
              </div>
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                  <FiShield className="h-3.5 w-3.5" />
                  Admin Profile
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{userName}</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Review your account details and sign out when you are done.
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Account Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your login and organization details in one place.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard icon={<FiUser className="h-5 w-5" />} label="Full Name" value={user?.full_name || user?.name || "-"} />
              <InfoCard icon={<FiMail className="h-5 w-5" />} label="Email" value={user?.email || "-"} />
              <InfoCard icon={<FiShield className="h-5 w-5" />} label="Role" value="Admin" />
              <InfoCard icon={<FiBriefcase className="h-5 w-5" />} label="Username" value={user?.username || "-"} />
              <InfoCard icon={<FiHash className="h-5 w-5" />} label="Tenant Slug" value={user?.tenant_slug || "-"} />
              <InfoCard icon={<FiCalendar className="h-5 w-5" />} label="Company ID" value={user?.company_id ?? "-"} />
            </div>
          </div>

          <aside className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-6 xl:border-l xl:border-t-0">
            <h2 className="text-lg font-semibold text-slate-900">Account Notes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Admin profile editing is not wired up yet, so this page is read-only for now. If you want, we can
              add editable admin account settings next using the same pattern as the employee profile screen.
            </p>
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
              Keep your company details and login information secure.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        {icon ? <div className="text-slate-500">{icon}</div> : null}
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">{label}</p>
      </div>
      <p className="mt-3 break-words text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
