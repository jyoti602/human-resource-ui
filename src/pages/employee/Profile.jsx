import { useEffect, useState } from "react";

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

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="mt-1 text-gray-500">
          Complete and maintain your personal details after your account is created by admin.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-lg">
        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading profile...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">
                {error}
              </div>
            )}

            <ProfileField
              label="Full Name"
              name="name"
              value={draft.name}
              editable={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Email"
              name="email"
              type="email"
              value={draft.email}
              editable={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Department"
              name="department"
              value={profile.department}
              editable={false}
            />

            <ProfileField
              label="Position"
              name="position"
              value={profile.position}
              editable={false}
            />

            <ProfileField
              label="Phone"
              name="phone"
              value={draft.phone}
              editable={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={draft.date_of_birth}
              editable={isEditing}
              onChange={handleChange}
            />

            <ProfileField
              label="Joining Date"
              name="joining_date"
              type="date"
              value={profile.joining_date}
              editable={false}
            />

            <ProfileField
              label="Emergency Contact"
              name="emergency_contact"
              value={draft.emergency_contact}
              editable={isEditing}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <ProfileField
                label="Address"
                name="address"
                value={draft.address}
                editable={isEditing}
                onChange={handleChange}
              />
            </div>

            <ProfileField
              label="Account Status"
              name="status"
              value={profile.status}
              editable={false}
            />

            <ProfileField
              label="Login Username"
              name="username"
              value={user?.username || ""}
              editable={false}
            />

            <div className="flex gap-4 pt-2 md:col-span-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-lg bg-gray-400 px-6 py-2 text-white transition hover:bg-gray-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700"
                >
                  Complete / Edit Profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileField({ label, name, value, editable, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={!editable}
        className={`w-full rounded-lg border px-4 py-2 ${
          editable
            ? "border-gray-300 focus:ring-2 focus:ring-indigo-500"
            : "bg-gray-100 text-gray-700"
        }`}
      />
    </div>
  );
}
