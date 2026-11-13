
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  ChevronRight,
  LogOut,
  Settings,
  Trash2,
  User,
  X,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

import "./Student.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

type LearningLevel = "primary" | "secondary" | "tertiary" | "skills";

interface StudentProfile {
  id?: string | number;
  username?: string;
  name?: string;
  email?: string;
  level?: LearningLevel | string;
  dateOfBirth?: string | null;
  phoneNumber?: string | null;
  alternativePhoneNumber?: string | null;
  district?: string | null;
  ta?: string | null;
  country?: string | null;
  nationalIdStatus?: string | null;
  profilePicture?: string | null;
}

interface Course {
  id: string | number;
  title: string;
  description?: string;
  code?: string;
  level?: string;
  category?: string;
}

interface Teacher {
  id?: string | number;
  name?: string;
  fullName?: string;
  email?: string;
}

interface Tutor {
  id?: string | number;
  name?: string;
  fullName?: string;
  email?: string;
}

interface Enrollment {
  id: string | number;
  course?: Course;
  subject?: Course;
  courseId?: string | number;
  subjectId?: string | number;
  status?: string;
  paymentStatus?: string;
  ticketStatus?: string;
  ticket?: {
    id?: string | number;
    status?: string;
    ticketNumber?: string;
  };
  teacher?: Teacher;
  tutor?: Tutor;
  createdAt?: string;
  enrolledAt?: string;
}

interface Notification {
  id: string | number;
  title?: string;
  message?: string;
  type?: string;
  read?: boolean;
  createdAt?: string;
  link?: string;
}

const normalizeLevel = (level?: string): LearningLevel | "" => {
  const value = String(level || "").toLowerCase().trim();

  if (value === "primary") return "primary";
  if (value === "secondary") return "secondary";
  if (value === "tertiary") return "tertiary";

  if (value === "skills" || value === "practical skills") {
    return "skills";
  }

  return "";
};

const formatLevel = (level?: string) => {
  const normalized = normalizeLevel(level);

  if (normalized === "skills") return "Practical Skills";
  if (!normalized) return level || "";

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getStoredStudent = (): StudentProfile | null => {
  try {
    const stored = localStorage.getItem("gracia_current_user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getDisplayName = (student: StudentProfile | null) => {
  if (!student) return "Student";

  return (
    student.name ||
    student.username ||
    student.email?.split("@")[0] ||
    "Student"
  );
};

const getCourseFromEnrollment = (
  enrollment: Enrollment
): Course | undefined => {
  return enrollment.course || enrollment.subject;
};

const getTeacherName = (teacher?: Teacher) => {
  if (!teacher) return "Not assigned";
  return teacher.name || teacher.fullName || "Assigned";
};

const getTutorName = (tutor?: Tutor) => {
  if (!tutor) return "Not assigned";
  return tutor.name || tutor.fullName || "Assigned";
};

const getStatusClass = (status?: string) => {
  const value = String(status || "").toLowerCase();

  if (
    value.includes("paid") ||
    value.includes("confirm") ||
    value.includes("active") ||
    value.includes("success") ||
    value.includes("issued")
  ) {
    return "status-success";
  }

  if (
    value.includes("pending") ||
    value.includes("processing") ||
    value.includes("await")
  ) {
    return "status-pending";
  }

  if (
    value.includes("failed") ||
    value.includes("cancel") ||
    value.includes("reject")
  ) {
    return "status-danger";
  }

  return "status-neutral";
};

const getPaymentStatus = (enrollment: Enrollment) =>
  enrollment.paymentStatus || "Not available";

const getTicketStatus = (enrollment: Enrollment) =>
  enrollment.ticketStatus ||
  enrollment.ticket?.status ||
  "Not issued";

const getEnrollmentStatus = (enrollment: Enrollment) =>
  enrollment.status || "Registered";

const formatDate = (date?: string) => {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const extractArray = <T,>(response: any, keys: string[] = []): T[] => {
  if (Array.isArray(response)) return response;

  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
    if (Array.isArray(response?.data?.[key])) return response.data[key];
  }

  if (Array.isArray(response?.data)) return response.data;

  return [];
};

const extractUser = (response: any): StudentProfile | null => {
  if (response?.user) return response.user;
  if (response?.data?.user) return response.data.user;

  if (
    response?.data &&
    !Array.isArray(response.data) &&
    typeof response.data === "object"
  ) {
    return response.data;
  }

  if (response && typeof response === "object" && response.id) {
    return response;
  }

  return null;
};

const isProfileComplete = (student: StudentProfile | null) => {
  if (!student) return false;

  return Boolean(
    student.dateOfBirth &&
      student.phoneNumber?.trim() &&
      student.district?.trim() &&
      student.ta?.trim() &&
      student.country?.trim() &&
      student.nationalIdStatus?.trim()
  );
};

const Student: React.FC = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState<StudentProfile | null>(
    getStoredStudent()
  );

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [error, setError] = useState("");
  const [profileComplete, setProfileComplete] = useState(
    isProfileComplete(getStoredStudent())
  );

  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [deletionError, setDeletionError] = useState("");

  const token = localStorage.getItem("token");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("gracia_current_user");
    localStorage.removeItem("gracia_remember_me");
    localStorage.removeItem("gracia_login_email");
    localStorage.removeItem("gracia_student");
    localStorage.removeItem("gracia_registered_email");

    window.dispatchEvent(new Event("gracia:auth-changed"));
    navigate("/login", { replace: true });
  }, [navigate]);

  /*
   * Load the authenticated student, their profile and their
   * actual registered learning items.
   */
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const [userResponse, enrollmentResponse, profileResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/auth/me`, { headers }),
            fetch(`${API_BASE_URL}/enrollments/my`, { headers }),
            fetch(`${API_BASE_URL}/users/me/profile`, { headers }),
          ]);

        if (
          userResponse.status === 401 ||
          userResponse.status === 403 ||
          profileResponse.status === 401 ||
          profileResponse.status === 403
        ) {
          if (!cancelled) handleLogout();
          return;
        }

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const authenticatedStudent = extractUser(userData);

          if (authenticatedStudent && !cancelled) {
            setStudent((current) => ({
              ...current,
              ...authenticatedStudent,
            }));

            localStorage.setItem(
              "gracia_current_user",
              JSON.stringify({
                ...getStoredStudent(),
                ...authenticatedStudent,
              })
            );
          }
        }

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const profile = extractUser(profileData);

          if (profile && !cancelled) {
            setStudent((current) => ({ ...current, ...profile }));
            setProfileComplete(isProfileComplete(profile));

            localStorage.setItem(
              "gracia_current_user",
              JSON.stringify({
                ...getStoredStudent(),
                ...profile,
              })
            );

            window.dispatchEvent(new Event("gracia:user-updated"));
          }
        } else if (!cancelled) {
          setProfileComplete(false);
        }

        if (enrollmentResponse.ok) {
          const enrollmentData = await enrollmentResponse.json();

          const realEnrollments = extractArray<Enrollment>(
            enrollmentData,
            ["enrollments", "items", "results"]
          );

          if (!cancelled) setEnrollments(realEnrollments);
        } else if (enrollmentResponse.status !== 404 && !cancelled) {
          setError(
            "Your profile loaded, but we could not load your registered learning. Please refresh the page."
          );
        } else if (
          enrollmentResponse.status === 404 &&
          !cancelled
        ) {
          setEnrollments([]);
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);

        if (!cancelled) {
          setError(
            "We could not load your dashboard information. Check your connection and try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [token, navigate, handleLogout]);

  /*
   * Load actual notifications belonging to the authenticated student.
   */
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const loadNotifications = async () => {
      setLoadingNotifications(true);

      try {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          if (!cancelled) handleLogout();
          return;
        }

        if (!response.ok) {
          if (!cancelled) setNotifications([]);
          return;
        }

        const data = await response.json();

        const realNotifications = extractArray<Notification>(data, [
          "notifications",
          "items",
          "results",
        ]);

        if (!cancelled) setNotifications(realNotifications);
      } catch (err) {
        console.error("Notification loading error:", err);
        if (!cancelled) setNotifications([]);
      } finally {
        if (!cancelled) setLoadingNotifications(false);
      }
    };

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [token, handleLogout]);

  const studentLevel = normalizeLevel(student?.level);

  const isSchoolLevel =
    studentLevel === "primary" || studentLevel === "secondary";

  const cataloguePath = isSchoolLevel ? "/subjects" : "/courses";
  const catalogueLabel = isSchoolLevel ? "Browse subjects" : "Browse courses";

  const learningTitle = isSchoolLevel
    ? "My Registered Subjects"
    : "My Registered Courses";

  /*
   * Keep only learning items appropriate for this student's level.
   * Items without level information are retained because the API
   * may not include the related item's level in every response.
   */
  const visibleEnrollments = useMemo(() => {
    if (!studentLevel) return enrollments;

    return enrollments.filter((enrollment) => {
      const item = getCourseFromEnrollment(enrollment);
      const itemLevel = normalizeLevel(item?.level);

      if (isSchoolLevel) {
        return (
          Boolean(enrollment.subject || enrollment.subjectId) ||
          itemLevel === "primary" ||
          itemLevel === "secondary"
        );
      }

      return (
        Boolean(enrollment.course || enrollment.courseId) ||
        itemLevel === "tertiary" ||
        itemLevel === "skills"
      );
    });
  }, [enrollments, studentLevel, isSchoolLevel]);

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  ).length;

  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      navigate(notification.link);
      return;
    }

    if (
      String(notification.type || "").toLowerCase().includes("profile") ||
      String(notification.title || "").toLowerCase().includes("profile")
    ) {
      navigate("/profile");
    }
  };

  const handleDeleteAccount = async () => {
    setDeletionError("");

    if (!token || !student?.id) {
      setDeletionError(
        "We could not identify your account. Please sign in again."
      );
      return;
    }

    try {
      setDeletingAccount(true);

      /*
       * This request requires a secure authenticated deletion endpoint.
       * Do not enable permanent deletion in production until the backend
       * provides one that verifies the current user and handles related data.
       */
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.message ||
            "Account deletion is not available yet. Please contact Gracia Education Hub support."
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("gracia_current_user");
      localStorage.removeItem("gracia_remember_me");
      localStorage.removeItem("gracia_login_email");
      localStorage.removeItem("gracia_student");
      localStorage.removeItem("gracia_registered_email");

      window.dispatchEvent(new Event("gracia:auth-changed"));
      navigate("/login", { replace: true });
    } catch (err) {
      setDeletionError(
        err instanceof Error
          ? err.message
          : "Your account could not be deleted."
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) {
    return (
      <div className="student-page">
        <Navbar />

        <main className="student-dashboard">
          <div className="dashboard-loading">
            <div className="loading-spinner" />
            <p>Loading your dashboard...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="student-page">
      <Navbar />

      {/* Notifications */}
      <div className="student-notification-bar">
        <div className="student-notification-inner">
          <div className="notification-label">
            <Bell size={18} />

            <span>
              Notifications
              {unreadNotifications > 0 && (
                <strong>{unreadNotifications}</strong>
              )}
            </span>
          </div>

          <div className="notification-content">
            {loadingNotifications ? (
              <span>Loading notifications...</span>
            ) : notifications.length === 0 ? (
              <span>You have no new notifications.</span>
            ) : (
              <div className="notification-list">
                {notifications.slice(0, 3).map((notification) => (
                  <button
                    type="button"
                    className={`notification-item ${
                      notification.read ? "" : "unread"
                    }`}
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <span className="notification-dot" />

                    <span className="notification-text">
                      <strong>
                        {notification.title || "Notification"}
                      </strong>

                      {notification.message && (
                        <small>{notification.message}</small>
                      )}
                    </span>

                    {notification.createdAt && (
                      <small className="notification-date">
                        {formatDate(notification.createdAt)}
                      </small>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 3 && (
            <button
              type="button"
              className="view-notifications"
              onClick={() => {
                navigate("/notifications");
              }}
            >
              View all
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      <main className="student-dashboard">
        <div className="dashboard-container">
          {/* Dashboard heading */}
          <section className="dashboard-header">
            <div>
              <p className="dashboard-eyebrow">Student Dashboard</p>

              <h1>Welcome, {getDisplayName(student)}</h1>

              <p className="dashboard-description">
                Manage your registered learning and account from one place.
              </p>
            </div>

            <div className="dashboard-actions">
              <Link to="/profile" className="profile-button">
                <User size={17} />
                Profile
              </Link>

              <button
                type="button"
                className="settings-button"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={17} />
                Settings
              </button>
            </div>
          </section>

          {error && (
            <div className="dashboard-error" role="alert">
              {error}
            </div>
          )}

          {/* Profile completion reminder */}
          {!profileComplete && (
            <section className="profile-completion-card">
              <div className="profile-completion-icon">
                <AlertCircle size={22} />
              </div>

              <div className="profile-completion-copy">
                <strong>Complete your student profile</strong>
                <p>
                  Add your required personal and contact details before
                  registering for a course or subject. Some saved details
                  cannot be changed later without contacting support.
                </p>
              </div>

              <Link to="/profile" className="primary-button">
                Complete profile
                <ChevronRight size={17} />
              </Link>
            </section>
          )}

          {profileComplete && (
            <div className="profile-complete-banner">
              <ShieldCheck size={18} />
              Your required profile details are complete.
              <Link to="/profile">View profile</Link>
            </div>
          )}

          {/* Student information */}
          <section className="student-information">
            <div>
              <span className="info-label">Student</span>
              <strong>{getDisplayName(student)}</strong>
            </div>

            {student?.email && (
              <div>
                <span className="info-label">Email</span>
                <strong>{student.email}</strong>
              </div>
            )}

            {studentLevel && (
              <div>
                <span className="info-label">Learning Level</span>
                <strong>{formatLevel(studentLevel)}</strong>
              </div>
            )}
          </section>

          {/* Registered learning */}
          <section className="registered-section">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">My Learning</p>

                <h2>{learningTitle}</h2>

                <p>
                  Only learning items returned by your registration records
                  should appear here.
                </p>
              </div>

              <Link to={cataloguePath} className="browse-link">
                {catalogueLabel}
                <ChevronRight size={17} />
              </Link>
            </div>

            {visibleEnrollments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <BookOpen size={24} />
                </div>

                <h3>
                  {isSchoolLevel
                    ? "No registered subjects yet"
                    : "No registered courses yet"}
                </h3>

                <p>
                  {isSchoolLevel
                    ? "Your registered subjects will appear here once your registration is confirmed."
                    : "Your registered courses will appear here once your registration is confirmed."}
                </p>

                {profileComplete ? (
                  <Link to={cataloguePath} className="primary-button">
                    {isSchoolLevel ? "Explore Subjects" : "Explore Courses"}
                  </Link>
                ) : (
                  <Link to="/profile" className="primary-button">
                    Complete profile first
                  </Link>
                )}
              </div>
            ) : (
              <div className="registered-list">
                {visibleEnrollments.map((enrollment) => {
                  const item = getCourseFromEnrollment(enrollment);

                  if (!item) return null;

                  const paymentStatus = getPaymentStatus(enrollment);
                  const ticketStatus = getTicketStatus(enrollment);

                  const openPath = isSchoolLevel
                    ? `/subjects`
                    : `/courses/${item.id}`;

                  return (
                    <article
                      className="registered-course"
                      key={enrollment.id}
                    >
                      <div className="course-main">
                        <div className="course-icon">
                          <BookOpen size={22} />
                        </div>

                        <div className="course-details">
                          <div className="course-heading">
                            <h3>{item.title}</h3>

                            {item.code && (
                              <span className="course-code">
                                {item.code}
                              </span>
                            )}
                          </div>

                          <div className="course-meta">
                            {item.level && (
                              <span>{formatLevel(item.level)}</span>
                            )}

                            {item.category && <span>{item.category}</span>}

                            {(enrollment.enrolledAt ||
                              enrollment.createdAt) && (
                              <span>
                                Registered{" "}
                                {formatDate(
                                  enrollment.enrolledAt ||
                                    enrollment.createdAt
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="course-status">
                        <div className="status-row">
                          <span>Registration</span>
                          <strong
                            className={getStatusClass(
                              getEnrollmentStatus(enrollment)
                            )}
                          >
                            {getEnrollmentStatus(enrollment)}
                          </strong>
                        </div>

                        <div className="status-row">
                          <span>Payment</span>
                          <strong className={getStatusClass(paymentStatus)}>
                            {paymentStatus}
                          </strong>
                        </div>

                        <div className="status-row">
                          <span>Ticket</span>
                          <strong className={getStatusClass(ticketStatus)}>
                            {ticketStatus}
                          </strong>
                        </div>
                      </div>

                      <div className="course-people">
                        {isSchoolLevel ? (
                          <div>
                            <span>Teacher</span>
                            <strong>
                              {getTeacherName(enrollment.teacher)}
                            </strong>
                          </div>
                        ) : (
                          <div>
                            <span>Tutor</span>
                            <strong>{getTutorName(enrollment.tutor)}</strong>
                          </div>
                        )}
                      </div>

                      <div className="course-action">
                        <Link to={openPath} className="course-open-button">
                          Open
                          <ChevronRight size={17} />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Account management */}
          <section className="account-section">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Account</p>
                <h2>Manage your account</h2>
                <p>
                  View your profile or manage your Gracia Education Hub
                  account.
                </p>
              </div>
            </div>

            <div className="account-actions">
              <Link to="/profile" className="account-action">
                <User size={20} />

                <span>
                  <strong>Manage Profile</strong>
                  <small>
                    View and update your profile information.
                  </small>
                </span>

                <ChevronRight size={18} />
              </Link>

              <button
                type="button"
                className="account-action"
                onClick={() => setShowSettings(true)}
              >
                <Settings size={20} />

                <span>
                  <strong>Settings</strong>
                  <small>Manage your account preferences.</small>
                </span>

                <ChevronRight size={18} />
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Settings drawer */}
      {showSettings && (
        <div
          className="settings-overlay"
          onClick={() => setShowSettings(false)}
        >
          <aside
            className="settings-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="settings-header">
              <div>
                <p>Account</p>
                <h2>Settings</h2>
              </div>

              <button
                type="button"
                className="close-settings"
                onClick={() => setShowSettings(false)}
                aria-label="Close settings"
              >
                <X size={20} />
              </button>
            </div>

            <div className="settings-body">
              <Link
                to="/profile"
                className="settings-option"
                onClick={() => setShowSettings(false)}
              >
                <User size={19} />

                <span>
                  <strong>Manage Profile</strong>
                  <small>Edit permitted student information.</small>
                </span>
              </Link>

              <button
                type="button"
                className="settings-option logout-option"
                onClick={handleLogout}
              >
                <LogOut size={19} />

                <span>
                  <strong>Logout</strong>
                  <small>Sign out of your Gracia account.</small>
                </span>
              </button>

              <div className="settings-danger">
                <div>
                  <Trash2 size={19} />

                  <span>
                    <strong>Delete Account</strong>
                    <small>
                      Permanently remove your account.
                    </small>
                  </span>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => {
                    setDeletionError("");
                    setShowDeleteConfirm(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Account deletion confirmation */}
      {showDeleteConfirm && (
        <div className="delete-overlay">
          <div className="delete-dialog">
            <div className="delete-icon">
              <Trash2 size={24} />
            </div>

            <h2>Delete your account?</h2>

            <p>
              Account deletion is permanent. Please make sure you understand
              what will happen to your registrations and associated records
              before proceeding.
            </p>

            {deletionError && (
              <div className="dashboard-error" role="alert">
                {deletionError}
              </div>
            )}

            <div className="delete-actions">
              <button
                type="button"
                className="cancel-delete"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingAccount}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete"
                onClick={() => void handleDeleteAccount()}
                disabled={deletingAccount}
              >
                {deletingAccount ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
