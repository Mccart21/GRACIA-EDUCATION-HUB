import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, Save, ShieldCheck, UserRound } from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

import "./Profile.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface StudentProfile {
  id: number | string;
  username?: string;
  email?: string;
  level?: string;
  dateOfBirth?: string | null;
  phoneNumber?: string | null;
  alternativePhoneNumber?: string | null;
  district?: string | null;
  ta?: string | null;
  country?: string | null;
  nationalIdStatus?: string | null;
  profilePicture?: string | null;
}

interface ProfileForm {
  dateOfBirth: string;
  phoneNumber: string;
  alternativePhoneNumber: string;
  district: string;
  ta: string;
  country: string;
  nationalIdStatus: string;
  profilePicture: string;
}

const emptyForm: ProfileForm = {
  dateOfBirth: "",
  phoneNumber: "",
  alternativePhoneNumber: "",
  district: "",
  ta: "",
  country: "Malawi",
  nationalIdStatus: "",
  profilePicture: "",
};

const toDateInput = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);

  return date.toISOString().slice(0, 10);
};

const Profile: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("gracia_current_user");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("We could not load your profile.");
        }

        const data = await response.json();
        const user: StudentProfile = data.user ?? data;

        setProfile(user);
        setForm({
          dateOfBirth: toDateInput(user.dateOfBirth),
          phoneNumber: user.phoneNumber ?? "",
          alternativePhoneNumber: user.alternativePhoneNumber ?? "",
          district: user.district ?? "",
          ta: user.ta ?? "",
          country: user.country ?? "Malawi",
          nationalIdStatus: user.nationalIdStatus ?? "",
          profilePicture: user.profilePicture ?? "",
        });

        localStorage.setItem("gracia_current_user", JSON.stringify(user));
        window.dispatchEvent(new Event("gracia:user-updated"));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [navigate, token]);

  const isLocked = (value?: string | null) =>
    value !== undefined && value !== null && value.trim() !== "";

  const locked = {
    dateOfBirth: isLocked(profile?.dateOfBirth),
    district: isLocked(profile?.district),
    ta: isLocked(profile?.ta),
    country: isLocked(profile?.country),
    nationalIdStatus: isLocked(profile?.nationalIdStatus),
  };

  const profileComplete = Boolean(
    form.dateOfBirth.trim() &&
      form.phoneNumber.trim() &&
      form.district.trim() &&
      form.ta.trim() &&
      form.country.trim() &&
      form.nationalIdStatus.trim()
  );

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    if (!profileComplete) {
      setError("Please complete all required fields before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/profile`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateOfBirth: form.dateOfBirth,
          phoneNumber: form.phoneNumber.trim(),
          alternativePhoneNumber: form.alternativePhoneNumber.trim() || undefined,
          district: form.district.trim(),
          ta: form.ta.trim(),
          country: form.country.trim(),
          nationalIdStatus: form.nationalIdStatus,
          profilePicture: form.profilePicture.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(" ")
          : data.message;

        throw new Error(message || "Your profile could not be saved.");
      }

      const savedProfile: StudentProfile = data.user ?? {
        ...profile,
        ...form,
      };

      setProfile(savedProfile);
      setForm((current) => ({
        ...current,
        dateOfBirth: toDateInput(savedProfile.dateOfBirth ?? current.dateOfBirth),
      }));

      localStorage.setItem(
        "gracia_current_user",
        JSON.stringify(savedProfile)
      );
      window.dispatchEvent(new Event("gracia:user-updated"));

      setSuccess(data.message || "Your profile has been saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-main">
          <div className="profile-loading">Loading your profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        <div className="profile-container">
          <Link to="/student" className="profile-back-link">
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>

          <header className="profile-page-heading">
            <div className="profile-heading-icon">
              <UserRound size={25} />
            </div>
            <div>
              <p className="profile-eyebrow">Student account</p>
              <h1>My profile</h1>
              <p>
                Keep your contact and personal information up to date.
              </p>
            </div>
          </header>

          <section className="profile-security-note">
            <ShieldCheck size={22} />
            <div>
              <strong>Your information is protected</strong>
              <p>
                Date of birth, district, Traditional Authority, country and
                national ID status become read-only after their first save.
                Contact support if a locked detail needs correction.
              </p>
            </div>
          </section>

          {profileComplete ? (
            <div className="profile-completion complete">
              <ShieldCheck size={18} />
              Your required profile details are complete.
            </div>
          ) : (
            <div className="profile-completion incomplete">
              Complete the required fields below before registering for a
              course or subject.
            </div>
          )}

          {error && <div className="profile-message error">{error}</div>}
          {success && <div className="profile-message success">{success}</div>}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-form-section">
              <h2>Account information</h2>

              <div className="profile-fields">
                <label>
                  Username
                  <input value={profile?.username ?? ""} readOnly />
                </label>

                <label>
                  Email address
                  <input value={profile?.email ?? ""} readOnly />
                </label>

                <label>
                  Learning level
                  <input value={profile?.level ?? ""} readOnly />
                </label>
              </div>
              <p className="profile-help">
                Contact support if your account email or learning level needs
                correction.
              </p>
            </div>

            <div className="profile-form-section">
              <h2>Personal details</h2>

              <div className="profile-fields">
                <label>
                  Date of birth <span>*</span>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    readOnly={locked.dateOfBirth}
                    required
                  />
                  {locked.dateOfBirth && (
                    <small className="locked-hint">
                      <LockKeyhole size={13} /> Locked after saving
                    </small>
                  )}
                </label>

                <label>
                  Country <span>*</span>
                  <input
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    readOnly={locked.country}
                    required
                    maxLength={100}
                  />
                  {locked.country && (
                    <small className="locked-hint">
                      <LockKeyhole size={13} /> Locked after saving
                    </small>
                  )}
                </label>

                <label>
                  District <span>*</span>
                  <input
                    value={form.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    readOnly={locked.district}
                    required
                    maxLength={100}
                  />
                  {locked.district && (
                    <small className="locked-hint">
                      <LockKeyhole size={13} /> Locked after saving
                    </small>
                  )}
                </label>

                <label>
                  Traditional Authority (TA) <span>*</span>
                  <input
                    value={form.ta}
                    onChange={(e) => updateField("ta", e.target.value)}
                    readOnly={locked.ta}
                    required
                    maxLength={100}
                  />
                  {locked.ta && (
                    <small className="locked-hint">
                      <LockKeyhole size={13} /> Locked after saving
                    </small>
                  )}
                </label>

                <label>
                  National ID status <span>*</span>
                  <select
                    value={form.nationalIdStatus}
                    onChange={(e) =>
                      updateField("nationalIdStatus", e.target.value)
                    }
                    disabled={locked.nationalIdStatus}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Available">I have a national ID</option>
                    <option value="Pending">Applied / pending</option>
                    <option value="Unavailable">I do not have one</option>
                  </select>
                  {locked.nationalIdStatus && (
                    <small className="locked-hint">
                      <LockKeyhole size={13} /> Locked after saving
                    </small>
                  )}
                </label>
              </div>
            </div>

            <div className="profile-form-section">
              <h2>Contact details</h2>

              <div className="profile-fields">
                <label>
                  Phone number <span>*</span>
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => updateField("phoneNumber", e.target.value)}
                    placeholder="e.g. 0881234567"
                    required
                    maxLength={30}
                  />
                </label>

                <label>
                  Alternative phone number
                  <input
                    type="tel"
                    value={form.alternativePhoneNumber}
                    onChange={(e) =>
                      updateField("alternativePhoneNumber", e.target.value)
                    }
                    placeholder="Optional"
                    maxLength={30}
                  />
                </label>

                <label className="profile-full-width">
                  Profile picture URL
                  <input
                    type="url"
                    value={form.profilePicture}
                    onChange={(e) =>
                      updateField("profilePicture", e.target.value)
                    }
                    placeholder="Optional image URL"
                    maxLength={500}
                  />
                  <small className="profile-help">
                    This field accepts an image URL; it does not upload a file.
                  </small>
                </label>
              </div>
            </div>

            <div className="profile-form-footer">
              <p>
                Fields marked <span>*</span> are required.
              </p>

              <button type="submit" disabled={saving}>
                <Save size={17} />
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;