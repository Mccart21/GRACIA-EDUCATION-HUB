import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Clock3,
  BookOpen,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";

import "./Courses.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

type CourseLevel = "Tertiary" | "Practical Skills";

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  category: string;
  duration: string;
  lessons: number;
  icon?: string;
  keywords: string[] | string;
  createdAt?: string;
  updatedAt?: string;
}

const Courses = () => {
  const [searchParams] = useSearchParams();

  const requestedLevel =
    searchParams.get("level")?.toLowerCase() || "";

  const requestedCategory =
    searchParams.get("category")?.toLowerCase() || "";

  const initialLevel: CourseLevel | "All" =
    requestedLevel === "tertiary"
      ? "Tertiary"
      : requestedCategory === "skills" ||
        requestedLevel === "skills"
      ? "Practical Skills"
      : "All";

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  const [selectedLevel, setSelectedLevel] = useState<
    CourseLevel | "All"
  >(initialLevel);

  const [expandedCourse, setExpandedCourse] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/courses`
        );

        if (!response.ok) {
          throw new Error("Failed to load courses.");
        }

        const data = await response.json();

        const formattedCourses: Course[] = data.map(
          (course: Course) => ({
            ...course,
            keywords:
              typeof course.keywords === "string"
                ? JSON.parse(course.keywords)
                : course.keywords || [],
          })
        );

        setCourses(formattedCourses);
      } catch (err) {
        console.error("Error loading courses:", err);

        setError(
          "Unable to load courses. Please make sure the Gracia backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  /*
   * COURSES PAGE ONLY SHOWS:
   * - University / Tertiary
   * - Practical Skills
   *
   * Primary and Secondary belong to the
   * Subjects page.
   */
  const availableCourses = useMemo(() => {
    return courses.filter(
      (course) =>
        course.level === "Tertiary" ||
        course.level === "Practical Skills"
    );
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return availableCourses.filter((course) => {
      const keywords =
        typeof course.keywords === "string"
          ? course.keywords
          : course.keywords.join(" ");

      const searchableText = [
        course.title,
        course.description,
        course.level,
        course.category,
        keywords,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        searchableText.includes(searchTerm);

      const matchesLevel =
        selectedLevel === "All" ||
        course.level === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [
    availableCourses,
    search,
    selectedLevel,
  ]);

  const toggleDetails = (courseId: number) => {
    setExpandedCourse((current) =>
      current === courseId ? null : courseId
    );
  };

  const resetSearch = () => {
    setSearch("");
    setSelectedLevel("All");
    setExpandedCourse(null);
  };

  return (
    <div className="courses-page">
      <Navbar />

      <main>
        <section className="courses-catalogue">
          <Container>
            {/* =========================================
                CATALOGUE HEADER
            ========================================= */}
            <div className="courses-catalogue-header">
              <div className="courses-heading">
                <span className="catalogue-label">
                  AVAILABLE COURSES
                </span>

                <h1>
                  For University And Practical skills
                </h1>
              </div>

              <div className="courses-search">
                <Search size={19} />

                <input
                  type="search"
                  value={search}
                  placeholder="Search courses..."
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* =========================================
                FILTERS
            ========================================= */}
            <div className="courses-toolbar">
              <div className="course-level-filter">
                <button
                  type="button"
                  className={
                    selectedLevel === "All"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedLevel("All")
                  }
                >
                  All
                </button>

                <button
                  type="button"
                  className={
                    selectedLevel === "Tertiary"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedLevel("Tertiary")
                  }
                >
                  University
                </button>

                <button
                  type="button"
                  className={
                    selectedLevel ===
                    "Practical Skills"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedLevel(
                      "Practical Skills"
                    )
                  }
                >
                  Practical Skills
                </button>
              </div>
            </div>

            {/* =========================================
                LOADING
            ========================================= */}
            {loading && (
              <div className="courses-message">
                <BookOpen size={28} />

                <h3>
                  Loading courses...
                </h3>

                <p>
                  Please wait while we load the
                  available programmes.
                </p>
              </div>
            )}

            {/* =========================================
                ERROR
            ========================================= */}
            {!loading && error && (
              <div className="courses-message error">
                <h3>
                  Unable to Load Courses
                </h3>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                >
                  Try Again
                </button>
              </div>
            )}

            {/* =========================================
                COURSE LIST
            ========================================= */}
            {!loading &&
              !error &&
              filteredCourses.length > 0 && (
                <div className="course-list">
                  {filteredCourses.map((course) => {
                    const isExpanded =
                      expandedCourse === course.id;

                    return (
                      <article
                        className={
                          isExpanded
                            ? "course-row expanded"
                            : "course-row"
                        }
                        key={course.id}
                      >
                        {/* =================================
                            MAIN COURSE ROW
                        ================================= */}
                        <div className="course-row-main">
                          <h2>
                            {course.title}
                          </h2>

                          <div className="course-row-actions">
                            {/* DETAILS */}
                            <button
                              type="button"
                              className="details-button"
                              onClick={() =>
                                toggleDetails(
                                  course.id
                                )
                              }
                              aria-expanded={
                                isExpanded
                              }
                            >
                              <span>
                                Details
                              </span>

                              {isExpanded ? (
                                <ChevronUp
                                  size={17}
                                />
                              ) : (
                                <ChevronDown
                                  size={17}
                                />
                              )}
                            </button>

                            {/* REGISTER
                                Goes directly to
                                subscription plans
                                while preserving
                                this course ID.
                            */}
                            <Link
                              to={`/subscriptions?courseId=${course.id}`}
                              className="register-button"
                            >
                              Register
                            </Link>
                          </div>
                        </div>

                        {/* =================================
                            EXPANDED DETAILS
                        ================================= */}
                        {isExpanded && (
                          <div className="course-details">
                            <div className="course-description">
                              <span>
                                Description
                              </span>

                              <p>
                                {course.description}
                              </p>
                            </div>

                            <div className="course-detail-grid">
                              <div className="detail-item">
                                <span>
                                  Level
                                </span>

                                <strong>
                                  {course.level ===
                                  "Tertiary"
                                    ? "University"
                                    : course.level}
                                </strong>
                              </div>

                              <div className="detail-item">
                                <span>
                                  Category
                                </span>

                                <strong>
                                  {course.category}
                                </strong>
                              </div>

                              <div className="detail-item">
                                <span>
                                  <Clock3
                                    size={15}
                                  />

                                  Duration
                                </span>

                                <strong>
                                  {course.duration ||
                                    "Flexible"}
                                </strong>
                              </div>

                              <div className="detail-item">
                                <span>
                                  <BookOpen
                                    size={15}
                                  />

                                  Lessons
                                </span>

                                <strong>
                                  {course.lessons}
                                </strong>
                              </div>
                            </div>

                            {Array.isArray(
                              course.keywords
                            ) &&
                              course.keywords
                                .length > 0 && (
                                <div className="course-keywords">
                                  <span>
                                    Topics
                                  </span>

                                  <div>
                                    {course.keywords.map(
                                      (
                                        keyword
                                      ) => (
                                        <small
                                          key={
                                            keyword
                                          }
                                        >
                                          {keyword}
                                        </small>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}

            {/* =========================================
                NO RESULTS
            ========================================= */}
            {!loading &&
              !error &&
              filteredCourses.length === 0 && (
                <div className="courses-message">
                  <Search size={28} />

                  <h3>
                    No courses found
                  </h3>

                  <p>
                    No university or practical
                    skills course matches your
                    search.
                  </p>

                  <button
                    type="button"
                    onClick={resetSearch}
                  >
                    Clear Search
                  </button>
                </div>
              )}
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;