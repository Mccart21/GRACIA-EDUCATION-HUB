
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Bell,
  UserRound,
  GraduationCap,
} from "lucide-react";

import EducatorNavbar from "../EducatorComponents/EducatorNavbar";
import EducatorFooter from "../EducatorComponents/EducatorFooter";
import "./EducatorPage.scss";

type EducatorRole = "teacher" | "tutor";

type EducatorSection =
  | "teaching-area"
  | "learning-materials"
  | "live-classes"
  | "notifications"
  | "educator-profile";

interface EducatorUser {
  id?: number | string;
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
}

function EducatorPage() {
  const navigate = useNavigate();

  const previewMode =
    import.meta.env.DEV &&
    import.meta.env.VITE_EDUCATOR_PREVIEW === "true";

  const [user, setUser] = useState<EducatorUser | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [previewRole, setPreviewRole] =
    useState<EducatorRole>("teacher");

  const [activeSection, setActiveSection] =
    useState<EducatorSection>("teaching-area");

  useEffect(() => {
    if (previewMode) {
      setUser({
        id: "educator-preview",
        name: "Educator Preview",
        fullName: "Educator Preview",
        email: "preview@gracia.local",
        role: "teacher",
      });

      setCheckingAccess(false);
      return;
    }

    const token =
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token");

    const storedUser = localStorage.getItem("gracia_current_user");

    if (!token || !storedUser) {
      setCheckingAccess(false);
      navigate("/educator-login", { replace: true });
      return;
    }

    try {
      const parsedUser: EducatorUser = JSON.parse(storedUser);
      const role = String(parsedUser.role || "").toLowerCase();

      if (role !== "teacher" && role !== "tutor") {
        setCheckingAccess(false);
        navigate("/educator-login", { replace: true });
        return;
      }

      setUser({ ...parsedUser, role });
    } catch {
      navigate("/educator-login", { replace: true });
    } finally {
      setCheckingAccess(false);
    }
  }, [navigate, previewMode]);

  // Read the selected section from the navbar URL hash.
  useEffect(() => {
    const sectionIds: EducatorSection[] = [
      "teaching-area",
      "learning-materials",
      "live-classes",
      "notifications",
      "educator-profile",
    ];

    const syncSectionFromHash = () => {
      const hash = window.location.hash.replace("#", "");

      if (sectionIds.includes(hash as EducatorSection)) {
        setActiveSection(hash as EducatorSection);
      } else {
        setActiveSection("teaching-area");
      }
    };

    syncSectionFromHash();
    window.addEventListener("hashchange", syncSectionFromHash);

    return () => {
      window.removeEventListener("hashchange", syncSectionFromHash);
    };
  }, []);

  if (checkingAccess || !user) {
    return (
      <div className="educator-loading">
        <p>Loading educator portal...</p>
      </div>
    );
  }

  const role: EducatorRole = previewMode
    ? previewRole
    : (user.role as EducatorRole);

  const isTeacher = role === "teacher";

  const displayName = previewMode
    ? "Educator Preview"
    : user.fullName || user.name || user.username || "Educator";

  const pageTitles: Record<EducatorSection, string> = {
    "teaching-area": "My Teaching Area",
    "learning-materials": "Learning Materials",
    "live-classes": "Live Online Classes",
    notifications: "Notifications",
    "educator-profile": "My Educator Account",
  };

  return (
    <div className="educator-page">
      <EducatorNavbar />

      <main className="educator-main">
        {previewMode && (
          <section className="educator-preview-banner">
            <strong>Development Preview Mode</strong>
            <p>
              This is a local preview, not a real authenticated educator
              account. No educator account or assignment is being created.
            </p>

            <label htmlFor="preview-role">
              Preview dashboard as:
            </label>

            <select
              id="preview-role"
              value={previewRole}
              onChange={(event) =>
                setPreviewRole(event.target.value as EducatorRole)
              }
            >
              <option value="teacher">
                Teacher — Primary/Secondary
              </option>
              <option value="tutor">
                Tutor — Tertiary/Practical Skills
              </option>
            </select>
          </section>
        )}

        <section className="educator-welcome">
          <div>
            <span className="educator-eyebrow">
              EDUCATOR WORKSPACE
            </span>
            <h1>Welcome, {displayName}</h1>
            <p>
              Manage your teaching activities, learning resources,
              and online classes from one place.
            </p>
          </div>

          <div className="educator-role">
            <GraduationCap size={22} />
            <div>
              <span>{previewMode ? "Previewing as" : "Signed in as"}</span>
              <strong>{isTeacher ? "Teacher" : "Tutor"}</strong>
            </div>
          </div>
        </section>

        <section
          className="educator-section educator-active-section"
          aria-live="polite"
        >
          <div className="educator-section__heading">
            <div>
              <h2>{pageTitles[activeSection]}</h2>
            </div>
          </div>

          {activeSection === "teaching-area" && (
            <>
              <p>
                {isTeacher
                  ? "Your teaching area covers Primary and Secondary Subjects."
                  : "Your teaching area covers Tertiary Courses and Practical Skills."}
              </p>

              <div className="educator-info-card">
                <span className="educator-info-card__icon">
                  <BookOpen size={23} />
                </span>
                <div>
                  <h3>{isTeacher ? "My Subjects" : "My Courses"}</h3>
                  <p>
                    {isTeacher
                      ? "Assigned Primary and Secondary subjects will appear here once educator assignments are connected."
                      : "Assigned Tertiary courses and Practical Skills will appear here once educator assignments are connected."}
                  </p>
                  <span className="educator-status">
                    Assignment connection pending
                  </span>
                </div>
              </div>
            </>
          )}

          {activeSection === "learning-materials" && (
            <>
              <p>
                Prepare and share learning resources with your students.
              </p>

              <div className="educator-feature-grid">
                <article className="educator-feature-card">
                  <span className="educator-feature-card__icon">
                    <FileText size={23} />
                  </span>
                  <h3>Lesson Notes and Resources</h3>
                  <p>
                    A dedicated area for lesson notes, documents,
                    and other learning materials.
                  </p>
                  <span className="educator-status">
                    Integration not connected
                  </span>
                </article>
              </div>
            </>
          )}

          {activeSection === "live-classes" && (
            <>
              <p>
                Schedule and manage online lessons with your students.
              </p>

              <div className="educator-feature-grid">
                <article className="educator-feature-card">
                  <span className="educator-feature-card__icon">
                    <CalendarDays size={23} />
                  </span>
                  <h3>Live Online Classes</h3>
                  <p>
                    Class scheduling and joining links will be available
                    after the live-class service is configured.
                  </p>
                  <span className="educator-status">
                    BigBlueButton not connected
                  </span>
                </article>
              </div>
            </>
          )}

          {activeSection === "notifications" && (
            <>
              <p>Important updates for your educator account.</p>

              <div className="educator-empty-state">
                <Bell size={25} />
                <h3>Notifications will appear here</h3>
                <p>
                  Notifications will be displayed once the notification
                  service is connected.
                </p>
              </div>
            </>
          )}

          {activeSection === "educator-profile" && (
            <>
              <p>
                Review the account currently used to access this portal.
              </p>

              <div className="educator-profile-card">
                <span className="educator-profile-card__icon">
                  <UserRound size={25} />
                </span>

                <div className="educator-profile-card__details">
                  <h3>{displayName}</h3>
                  <p>
                    {previewMode
                      ? "Local preview only"
                      : user.email || "Email not available"}
                  </p>
                  <span>{isTeacher ? "Teacher" : "Tutor"}</span>
                </div>

                {!previewMode && (
                  <button
                    type="button"
                    className="educator-profile-card__button"
                    onClick={() => navigate("/profile")}
                  >
                    View Profile
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <EducatorFooter />
    </div>
  );
}

export default EducatorPage;
