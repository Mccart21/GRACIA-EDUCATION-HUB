import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Play,
  Search,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";

import "./Student.scss";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* =========================================================
   TYPES
========================================================= */

type LearningLevel =
  | "primary"
  | "secondary"
  | "tertiary"
  | "skills";

interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  progress: number;
  lessons: number;
  completedLessons: number;
  duration: string;
  icon: string;
}

interface RecommendedCourse {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  lessons: number;
}

interface UpcomingLesson {
  month: string;
  day: string;
  title: string;
  time: string;
}

interface StudentProfile {
  name: string;
  email: string;
  level: LearningLevel;
}

interface BackendUser {
  id?: number | string;
  username?: string;
  name?: string;
  email?: string;
  level?: LearningLevel;
}

interface ProfileResponse {
  user?: BackendUser;
  message?: string;
}

/* =========================================================
   COURSES BY LEARNING LEVEL
========================================================= */

const coursesByLevel: Record<
  LearningLevel,
  Course[]
> = {
  primary: [
    {
      id: 1,
      title: "Primary Mathematics",
      category: "Mathematics",
      level: "Primary",
      progress: 72,
      lessons: 18,
      completedLessons: 13,
      duration: "6h 30m",
      icon: "01",
    },
    {
      id: 2,
      title: "English Language",
      category: "Languages",
      level: "Primary",
      progress: 48,
      lessons: 15,
      completedLessons: 7,
      duration: "5h 20m",
      icon: "02",
    },
    {
      id: 3,
      title: "Science & Discovery",
      category: "Science",
      level: "Primary",
      progress: 86,
      lessons: 20,
      completedLessons: 17,
      duration: "7h 10m",
      icon: "03",
    },
  ],

  secondary: [
    {
      id: 4,
      title: "Introduction to Mathematics",
      category: "Mathematics",
      level: "Secondary",
      progress: 72,
      lessons: 18,
      completedLessons: 13,
      duration: "6h 30m",
      icon: "01",
    },
    {
      id: 5,
      title: "English Language",
      category: "Languages",
      level: "Secondary",
      progress: 86,
      lessons: 20,
      completedLessons: 17,
      duration: "7h 10m",
      icon: "02",
    },
    {
      id: 6,
      title: "Computer Studies",
      category: "Technology",
      level: "Secondary",
      progress: 48,
      lessons: 15,
      completedLessons: 7,
      duration: "5h 20m",
      icon: "03",
    },
  ],

  tertiary: [
    {
      id: 7,
      title: "Database Systems",
      category: "Information Technology",
      level: "Tertiary",
      progress: 72,
      lessons: 18,
      completedLessons: 13,
      duration: "8h 30m",
      icon: "01",
    },
    {
      id: 8,
      title: "Web Application Development",
      category: "Technology",
      level: "Tertiary",
      progress: 48,
      lessons: 15,
      completedLessons: 7,
      duration: "9h 20m",
      icon: "02",
    },
    {
      id: 9,
      title: "Information Systems",
      category: "Academic",
      level: "Tertiary",
      progress: 86,
      lessons: 20,
      completedLessons: 17,
      duration: "7h 10m",
      icon: "03",
    },
  ],

  skills: [
    {
      id: 10,
      title: "Web Design Fundamentals",
      category: "Web Design",
      level: "Practical Skills",
      progress: 48,
      lessons: 15,
      completedLessons: 7,
      duration: "5h 20m",
      icon: "01",
    },
    {
      id: 11,
      title: "Graphic Design Basics",
      category: "Design",
      level: "Practical Skills",
      progress: 72,
      lessons: 18,
      completedLessons: 13,
      duration: "6h 30m",
      icon: "02",
    },
    {
      id: 12,
      title: "Digital Marketing",
      category: "Marketing",
      level: "Practical Skills",
      progress: 35,
      lessons: 12,
      completedLessons: 4,
      duration: "4h 45m",
      icon: "03",
    },
  ],
};

/* =========================================================
   RECOMMENDED COURSES
========================================================= */

const recommendedCoursesByLevel: Record<
  LearningLevel,
  RecommendedCourse[]
> = {
  primary: [
    {
      id: 101,
      title: "Creative Writing",
      category: "Languages",
      description:
        "Improve your writing, vocabulary and storytelling skills.",
      duration: "3h 20m",
      lessons: 10,
    },
    {
      id: 102,
      title: "Basic Computer Skills",
      category: "Technology",
      description:
        "Learn the basic computer skills every young learner should know.",
      duration: "3h 50m",
      lessons: 10,
    },
    {
      id: 103,
      title: "Science Experiments",
      category: "Science",
      description:
        "Explore simple and exciting science concepts through practical activities.",
      duration: "4h 15m",
      lessons: 12,
    },
  ],

  secondary: [
    {
      id: 104,
      title: "Study Skills & Techniques",
      category: "Academic",
      description:
        "Discover practical techniques to improve your learning and revision.",
      duration: "2h 40m",
      lessons: 8,
    },
    {
      id: 105,
      title: "Computer Fundamentals",
      category: "Technology",
      description:
        "Build essential computer skills for school, work and everyday life.",
      duration: "3h 50m",
      lessons: 10,
    },
    {
      id: 106,
      title: "Introduction to Physics",
      category: "Science",
      description:
        "Understand fundamental physics concepts through simple explanations.",
      duration: "5h 10m",
      lessons: 14,
    },
  ],

  tertiary: [
    {
      id: 107,
      title: "Programming Fundamentals",
      category: "Technology",
      description:
        "Build a strong foundation in programming and problem solving.",
      duration: "8h 20m",
      lessons: 20,
    },
    {
      id: 108,
      title: "Database Design",
      category: "Information Technology",
      description:
        "Learn how to design, organize and manage modern databases.",
      duration: "6h 45m",
      lessons: 16,
    },
    {
      id: 109,
      title: "Web Development",
      category: "Technology",
      description:
        "Learn how websites and modern web applications are developed.",
      duration: "9h 15m",
      lessons: 22,
    },
  ],

  skills: [
    {
      id: 110,
      title: "Graphic Design Basics",
      category: "Design",
      description:
        "Learn the foundations of graphic design and visual communication.",
      duration: "4h 45m",
      lessons: 12,
    },
    {
      id: 111,
      title: "Digital Marketing",
      category: "Marketing",
      description:
        "Learn how to promote products, services and brands online.",
      duration: "5h 30m",
      lessons: 14,
    },
    {
      id: 112,
      title: "Entrepreneurship Basics",
      category: "Business",
      description:
        "Develop practical knowledge for starting and managing a small business.",
      duration: "4h 10m",
      lessons: 11,
    },
  ],
};

/* =========================================================
   UPCOMING LESSONS
========================================================= */

const upcomingLessonsByLevel: Record<
  LearningLevel,
  UpcomingLesson[]
> = {
  primary: [
    {
      month: "AUG",
      day: "21",
      title: "Mathematics — Fractions",
      time: "10:00 AM · Lesson 14",
    },
    {
      month: "AUG",
      day: "22",
      title: "English — Grammar",
      time: "02:00 PM · Lesson 8",
    },
    {
      month: "AUG",
      day: "24",
      title: "Science — Plants",
      time: "09:00 AM · Lesson 18",
    },
  ],

  secondary: [
    {
      month: "AUG",
      day: "21",
      title: "Mathematics — Algebra",
      time: "10:00 AM · Lesson 14",
    },
    {
      month: "AUG",
      day: "22",
      title: "Computer Studies — CSS Basics",
      time: "02:00 PM · Lesson 8",
    },
    {
      month: "AUG",
      day: "24",
      title: "English — Grammar",
      time: "09:00 AM · Lesson 18",
    },
  ],

  tertiary: [
    {
      month: "AUG",
      day: "21",
      title: "Database Systems — SQL",
      time: "10:00 AM · Lesson 14",
    },
    {
      month: "AUG",
      day: "22",
      title: "Web Development — React",
      time: "02:00 PM · Lesson 8",
    },
    {
      month: "AUG",
      day: "24",
      title: "Information Systems — Analysis",
      time: "09:00 AM · Lesson 18",
    },
  ],

  skills: [
    {
      month: "AUG",
      day: "21",
      title: "Web Design — HTML Basics",
      time: "10:00 AM · Lesson 6",
    },
    {
      month: "AUG",
      day: "22",
      title: "Graphic Design — Typography",
      time: "02:00 PM · Lesson 8",
    },
    {
      month: "AUG",
      day: "24",
      title: "Digital Marketing — Social Media",
      time: "09:00 AM · Lesson 5",
    },
  ],
};

/* =========================================================
   HELPERS
========================================================= */

const formatLevel = (
  level: LearningLevel
): string => {
  switch (level) {
    case "primary":
      return "Primary Learner";

    case "secondary":
      return "Secondary Learner";

    case "tertiary":
      return "Tertiary Learner";

    case "skills":
      return "Practical Skills Learner";

    default:
      return "Learner";
  }
};

const getWelcomeMessage = (
  level: LearningLevel
): string => {
  switch (level) {
    case "primary":
      return "Keep building your foundation with engaging lessons designed for primary learners.";

    case "secondary":
      return "Keep developing your knowledge and prepare for your academic goals.";

    case "tertiary":
      return "Advance your knowledge with courses designed for higher-level learning.";

    case "skills":
      return "Build practical skills that can help you grow personally and professionally.";

    default:
      return "Keep going. Every lesson brings you one step closer to your goals.";
  }
};

/* =========================================================
   SAFE LOCAL STORAGE HELPER
========================================================= */

const getStoredStudent = (): StudentProfile | null => {
  const storedStudent =
    localStorage.getItem("gracia_student");

  if (!storedStudent) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedStudent);

    if (
      !parsed ||
      typeof parsed !== "object"
    ) {
      return null;
    }

    const validLevels: LearningLevel[] = [
      "primary",
      "secondary",
      "tertiary",
      "skills",
    ];

    const level = validLevels.includes(
      parsed.level
    )
      ? parsed.level
      : "secondary";

    return {
      name:
        typeof parsed.name === "string"
          ? parsed.name
          : "Student",

      email:
        typeof parsed.email === "string"
          ? parsed.email
          : "",

      level,
    };
  } catch {
    return null;
  }
};

/* =========================================================
   STUDENT COMPONENT
========================================================= */

const Student = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activeMenu, setActiveMenu] =
    useState("Dashboard");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [student, setStudent] =
    useState<StudentProfile | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  /* =======================================================
     LOAD AUTHENTICATED STUDENT
  ======================================================= */

  useEffect(() => {
    const loadStudent = async () => {
      const token =
        localStorage.getItem("gracia_token");

      const storedStudent =
        getStoredStudent();

      /*
       * No token means the user is not
       * authenticated.
       */

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      /*
       * First show the locally stored profile
       * so the dashboard can load immediately.
       */

      if (storedStudent) {
        setStudent(storedStudent);
      }

      /*
       * Try to retrieve the authenticated
       * user from the backend.
       *
       * This assumes a future/current endpoint:
       *
       * GET /api/auth/me
       *
       * If your backend does not have this endpoint
       * yet, the dashboard will safely continue using
       * gracia_student.
       */

      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        if (response.ok) {
          const data: ProfileResponse =
            await response.json();

          const backendUser =
            data.user;

          if (backendUser) {
            const currentStudent =
              storedStudent;

            const updatedStudent: StudentProfile =
              {
                name:
                  backendUser.name ||
                  backendUser.username ||
                  currentStudent?.name ||
                  "Student",

                email:
                  backendUser.email ||
                  currentStudent?.email ||
                  "",

                /*
                 * Keep the locally registered
                 * level until the backend User
                 * entity also stores level.
                 */
                level:
                  backendUser.level ||
                  currentStudent?.level ||
                  "secondary",
              };

            setStudent(updatedStudent);

            localStorage.setItem(
              "gracia_student",
              JSON.stringify(
                updatedStudent
              )
            );
          }
        } else if (
          response.status === 401 ||
          response.status === 403
        ) {
          /*
           * Token has expired or is invalid.
           */

          localStorage.removeItem(
            "gracia_token"
          );

          localStorage.removeItem(
            "gracia_user"
          );

          navigate("/login", {
            replace: true,
          });

          return;
        }
      } catch (error) {
        /*
         * If /auth/me does not exist yet or the
         * backend is temporarily unavailable,
         * don't destroy the dashboard.
         *
         * The locally stored registration profile
         * remains available.
         */

        console.warn(
          "Unable to retrieve student profile from backend:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadStudent();
  }, [navigate]);

  /* =======================================================
     STUDENT INFORMATION
  ======================================================= */

  const studentName =
    student?.name || "Student";

  const studentEmail =
    student?.email || "";

  const studentLevel: LearningLevel =
    student?.level || "secondary";

  /* =======================================================
     LEVEL-SPECIFIC DATA
  ======================================================= */

  const courses =
    coursesByLevel[studentLevel];

  const recommendedCourses =
    recommendedCoursesByLevel[
      studentLevel
    ];

  const upcomingLessons =
    upcomingLessonsByLevel[
      studentLevel
    ];

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredCourses = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) {
      return courses;
    }

    return courses.filter((course) =>
      `${course.title} ${course.category} ${course.level}`
        .toLowerCase()
        .includes(query)
    );
  }, [courses, searchQuery]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalLessons =
    courses.reduce(
      (total, course) =>
        total + course.lessons,
      0
    );

  const completedLessons =
    courses.reduce(
      (total, course) =>
        total + course.completedLessons,
      0
    );

  const averageProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce(
            (total, course) =>
              total + course.progress,
            0
          ) / courses.length
        )
      : 0;

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    setIsSigningOut(true);

    /*
     * Remove authentication information.
     *
     * We intentionally keep gracia_student because
     * the registration level is still useful when
     * the user logs in again.
     */

    localStorage.removeItem(
      "gracia_token"
    );

    localStorage.removeItem(
      "gracia_user"
    );

    localStorage.removeItem(
      "gracia_remember_me"
    );

    localStorage.removeItem(
      "gracia_login_email"
    );

    navigate("/login", {
      replace: true,
    });
  };

  /* =======================================================
     MENU
  ======================================================= */

  const handleMenuClick = (
    menu: string
  ) => {
    setActiveMenu(menu);
    setSidebarOpen(false);

    switch (menu) {
      case "Dashboard":
        navigate("/student");
        break;

      case "My Courses":
        navigate("/courses");
        break;

      case "Explore Courses":
        navigate("/courses");
        break;

      case "Calendar":
        /*
         * Keep this ready for the calendar page.
         * If the route does not exist yet, the
         * dashboard remains usable.
         */
        navigate("/calendar");
        break;

      case "Profile":
        navigate("/profile");
        break;

      case "Settings":
        navigate("/settings");
        break;

      default:
        break;
    }
  };

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (isLoading && !student) {
    return (
      <div className="student-loading-screen">
        <div className="student-loading-card">
          <div className="student-loading-logo">
            G
          </div>

          <div className="student-loading-spinner" />

          <h2>
            Loading your dashboard
          </h2>

          <p>
            Please wait while we prepare
            your learning space.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="student-dashboard">

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="student-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`student-sidebar ${
          sidebarOpen
            ? "student-sidebar-open"
            : ""
        }`}
      >

        <div className="student-sidebar-top">

          {/* LOGO */}

          <Link
            to="/"
            className="student-brand"
          >
            <div className="student-brand-mark">
              G
            </div>

            <div className="student-brand-text">
              <strong>
                GRACIA
              </strong>

              <span>
                EDUCATION HUB
              </span>
            </div>
          </Link>

          {/* MOBILE CLOSE */}

          <button
            className="sidebar-close"
            type="button"
            aria-label="Close navigation"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="student-navigation">

          <span className="navigation-label">
            MAIN MENU
          </span>

          <button
            type="button"
            className={`student-nav-item ${
              activeMenu === "Dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick(
                "Dashboard"
              )
            }
          >
            <LayoutDashboard size={18} />

            <span>
              Dashboard
            </span>
          </button>

          <button
            type="button"
            className={`student-nav-item ${
              activeMenu === "My Courses"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick(
                "My Courses"
              )
            }
          >
            <BookOpen size={18} />

            <span>
              My Courses
            </span>
          </button>

          <button
            type="button"
            className={`student-nav-item ${
              activeMenu ===
              "Explore Courses"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick(
                "Explore Courses"
              )
            }
          >
            <GraduationCap size={18} />

            <span>
              Explore Courses
            </span>
          </button>

          <button
            type="button"
            className={`student-nav-item ${
              activeMenu === "Calendar"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick(
                "Calendar"
              )
            }
          >
            <CalendarDays size={18} />

            <span>
              Calendar
            </span>
          </button>

          <span className="navigation-label second-label">
            ACCOUNT
          </span>

          <button
            type="button"
            className={`student-nav-item ${
              activeMenu === "Profile"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick(
                "Profile"
              )
            }
          >
            <User size={18} />

            <span>
              My Profile
            </span>
          </button>

          <button
            type="button"
            className={`student-nav-item ${
              activeMenu === "Settings"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleMenuClick(
                "Settings"
              )
            }
          >
            <Settings size={18} />

            <span>
              Settings
            </span>
          </button>

        </nav>

        {/* =================================================
            SUBSCRIPTION
        ================================================= */}

        <div className="sidebar-subscription">

          <div className="subscription-icon">
            <Sparkles size={17} />
          </div>

          <strong>
            Learning Pass
          </strong>

          <p>
            Your weekly subscription
            is active.
          </p>

          <div className="subscription-date">

            <span>
              Expires
            </span>

            <strong>
              Aug 27, 2026
            </strong>

          </div>

          <Link to="/subscriptions">
            Manage subscription
            <ChevronRight size={14} />
          </Link>

        </div>

        {/* =================================================
            LOGOUT
        ================================================= */}

        <button
          type="button"
          className="student-logout"
          onClick={handleLogout}
          disabled={isSigningOut}
        >
          <LogOut size={17} />

          <span>
            {isSigningOut
              ? "Signing out..."
              : "Sign out"}
          </span>
        </button>

      </aside>

      {/* ===================================================
          MAIN AREA
      =================================================== */}

      <main className="student-main">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="student-topbar">

          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Open navigation"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={21} />
          </button>

          {/* SEARCH */}

          <div className="student-search">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
            />

          </div>

          {/* RIGHT SIDE */}

          <div className="student-topbar-right">

            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span />
            </button>

            <div className="topbar-divider" />

            <button
              type="button"
              className="student-profile-mini"
              onClick={() =>
                handleMenuClick(
                  "Profile"
                )
              }
            >

              <div className="profile-avatar">
                {studentName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="profile-mini-info">

                <strong>
                  {studentName}
                </strong>

                <span>
                  {formatLevel(
                    studentLevel
                  )}
                </span>

              </div>

              <ChevronRight size={15} />

            </button>

          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="student-content">

          {/* =================================================
              WELCOME
          ================================================= */}

          <section className="student-welcome">

            <div>

              <span className="welcome-label">
                {new Date()
                  .toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  )
                  .toUpperCase()}
              </span>

              <h1>
                Welcome back,{" "}
                <span>
                  {studentName}
                </span>
              </h1>

              <p>
                {getWelcomeMessage(
                  studentLevel
                )}
              </p>

            </div>

            <Link
              to="/courses"
              className="browse-courses-button"
            >
              <BookOpen size={17} />
              Browse courses
            </Link>

          </section>

          {/* =================================================
              LEVEL BADGE
          ================================================= */}

          <div
            className="student-level-banner"
            style={{
              marginBottom: "24px",
            }}
          >

            <GraduationCap size={20} />

            <div>

              <strong>
                Your Learning Level
              </strong>

              <span>
                {formatLevel(
                  studentLevel
                )}
              </span>

            </div>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <section className="student-stats">

            <div className="student-stat-card">

              <div className="stat-icon blue">
                <BookOpen size={19} />
              </div>

              <div className="stat-information">

                <span>
                  Enrolled Courses
                </span>

                <strong>
                  {courses.length}
                </strong>

              </div>

            </div>

            <div className="student-stat-card">

              <div className="stat-icon gold">
                <Play size={19} />
              </div>

              <div className="stat-information">

                <span>
                  Lessons Completed
                </span>

                <strong>
                  {completedLessons}
                </strong>

              </div>

            </div>

            <div className="student-stat-card">

              <div className="stat-icon green">
                <Clock3 size={19} />
              </div>

              <div className="stat-information">

                <span>
                  Learning Hours
                </span>

                <strong>
                  18.5
                </strong>

              </div>

            </div>

            <div className="student-stat-card">

              <div className="stat-icon purple">
                <GraduationCap size={19} />
              </div>

              <div className="stat-information">

                <span>
                  Average Progress
                </span>

                <strong>
                  {averageProgress}%
                </strong>

              </div>

            </div>

          </section>

          {/* =================================================
              CURRENT LEARNING
          ================================================= */}

          <section className="learning-section">

            <div className="section-title-row">

              <div>

                <span>
                  KEEP LEARNING
                </span>

                <h2>
                  Continue Learning
                </h2>

              </div>

              <Link to="/courses">
                View all
                <ChevronRight size={15} />
              </Link>

            </div>

            <div className="course-progress-list">

              {filteredCourses.length ===
              0 ? (

                <div className="no-courses-message">

                  <BookOpen size={30} />

                  <h3>
                    No courses found
                  </h3>

                  <p>
                    Try searching for a
                    different course.
                  </p>

                </div>

              ) : (

                filteredCourses.map(
                  (course) => (

                    <div
                      className="student-course-card"
                      key={course.id}
                    >

                      <div className="course-number">
                        {course.icon}
                      </div>

                      <div className="student-course-main">

                        <div className="course-card-header">

                          <div>

                            <span className="course-category">
                              {course.category}
                            </span>

                            <h3>
                              {course.title}
                            </h3>

                          </div>

                          <span className="course-level">
                            {course.level}
                          </span>

                        </div>

                        <div className="course-progress-info">

                          <span>
                            {
                              course.completedLessons
                            }{" "}
                            of{" "}
                            {
                              course.lessons
                            }{" "}
                            lessons
                          </span>

                          <strong>
                            {course.progress}%
                          </strong>

                        </div>

                        <div className="course-progress-bar">

                          <span
                            style={{
                              width: `${course.progress}%`,
                            }}
                          />

                        </div>

                        <div className="course-card-bottom">

                          <div className="course-duration">

                            <Clock3 size={13} />

                            {course.duration}

                          </div>

                          <Link
                            to={`/course-details?id=${course.id}`}
                            className="continue-button"
                          >
                            Continue
                            <ChevronRight
                              size={15}
                            />
                          </Link>

                        </div>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>

          {/* =================================================
              LOWER GRID
          ================================================= */}

          <div className="student-lower-grid">

            {/* UPCOMING */}

            <section className="upcoming-section">

              <div className="section-title-row">

                <div>

                  <span>
                    YOUR SCHEDULE
                  </span>

                  <h2>
                    Upcoming Lessons
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleMenuClick(
                      "Calendar"
                    )
                  }
                >
                  View calendar
                </button>

              </div>

              <div className="upcoming-list">

                {upcomingLessons.map(
                  (lesson, index) => (

                    <div
                      className="upcoming-item"
                      key={`${lesson.title}-${index}`}
                    >

                      <div className="upcoming-date">

                        <span>
                          {lesson.month}
                        </span>

                        <strong>
                          {lesson.day}
                        </strong>

                      </div>

                      <div className="upcoming-details">

                        <strong>
                          {lesson.title}
                        </strong>

                        <span>
                          {lesson.time}
                        </span>

                      </div>

                      <button
                        type="button"
                        className="upcoming-play"
                        aria-label={`Start ${lesson.title}`}
                      >
                        <Play size={14} />
                      </button>

                    </div>

                  )
                )}

              </div>

            </section>

            {/* SUMMARY */}

            <section className="learning-summary">

              <div className="section-title-row">

                <div>

                  <span>
                    YOUR ACTIVITY
                  </span>

                  <h2>
                    Learning Summary
                  </h2>

                </div>

              </div>

              <div
                className="summary-circle"
                style={{
                  background: `conic-gradient(
                    #1746a2 ${averageProgress}%,
                    #e8edf5 ${averageProgress}%
                  )`,
                }}
              >

                <div className="summary-circle-inner">

                  <strong>
                    {averageProgress}%
                  </strong>

                  <span>
                    Overall
                  </span>

                </div>

              </div>

              <div className="summary-items">

                <div>

                  <span>
                    Completed
                  </span>

                  <strong>
                    {completedLessons}
                  </strong>

                </div>

                <div>

                  <span>
                    In progress
                  </span>

                  <strong>
                    {Math.max(
                      totalLessons -
                        completedLessons,
                      0
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Certificates
                  </span>

                  <strong>
                    2
                  </strong>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RECOMMENDED
          ================================================= */}

          <section className="recommended-section">

            <div className="section-title-row">

              <div>

                <span>
                  DISCOVER
                </span>

                <h2>
                  Recommended for You
                </h2>

              </div>

              <Link to="/courses">
                Explore all
                <ChevronRight size={15} />
              </Link>

            </div>

            <div className="recommended-grid">

              {recommendedCourses.map(
                (course) => (

                  <div
                    className="recommended-card"
                    key={course.id}
                  >

                    <div className="recommended-image">

                      <div className="recommended-icon">

                        <GraduationCap
                          size={25}
                        />

                      </div>

                    </div>

                    <div className="recommended-content">

                      <span>
                        {course.category}
                      </span>

                      <h3>
                        {course.title}
                      </h3>

                      <p>
                        {course.description}
                      </p>

                      <div className="recommended-meta">

                        <span>
                          <BookOpen
                            size={13}
                          />
                          {course.lessons}
                          {" "}
                          lessons
                        </span>

                        <span>
                          <Clock3
                            size={13}
                          />
                          {course.duration}
                        </span>

                      </div>

                      <Link
                        to={`/course-details?id=${course.id}`}
                        className="recommended-button"
                      >
                        View course
                        <ArrowRight size={16} />
                      </Link>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

          {/* =================================================
              STUDENT ACCOUNT INFORMATION
          ================================================= */}

          <section className="student-account-strip">

            <div className="account-strip-icon">
              <User size={18} />
            </div>

            <div className="account-strip-info">

              <strong>
                {studentName}
              </strong>

              <span>
                {studentEmail ||
                  "Student account"}
              </span>

            </div>

            <span className="account-strip-level">
              {formatLevel(
                studentLevel
              )}
            </span>

          </section>

        </div>

      </main>

    </div>
  );
};

export default Student;