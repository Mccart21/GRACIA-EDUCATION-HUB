
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Search,
  X,
  BookOpen,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";

import "./Subjects.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

type SubjectLevel = "Primary" | "Secondary";

interface Teacher {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
  level: string;
  status: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  description: string;
  level: string;
  status: string;
  teachers: Teacher[];
  createdAt?: string;
  updatedAt?: string;
}

const Subjects = () => {
  const [searchParams] = useSearchParams();

  const requestedLevel =
    searchParams.get("level")?.toLowerCase() || "";

  const initialLevel: SubjectLevel | "All" =
    requestedLevel === "primary"
      ? "Primary"
      : requestedLevel === "secondary"
      ? "Secondary"
      : "All";

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");

  const [selectedLevel, setSelectedLevel] = useState<
    SubjectLevel | "All"
  >(initialLevel);

  const [expandedSubject, setExpandedSubject] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD SUBJECTS
  ========================================================= */

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/subjects`
        );

        if (!response.ok) {
          throw new Error("Failed to load subjects.");
        }

        const data: Subject[] = await response.json();

        setSubjects(data);
      } catch (err) {
        console.error("Error loading subjects:", err);

        setError(
          "Unable to load subjects. Please make sure the Gracia backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  /* =========================================================
     SUBJECTS PAGE ONLY SHOWS:
     - PRIMARY
     - SECONDARY

     University and Practical Skills belong to
     the Courses page.
  ========================================================= */

  const availableSubjects = useMemo(() => {
    return subjects.filter(
      (subject) =>
        subject.level.toLowerCase() === "primary" ||
        subject.level.toLowerCase() === "secondary"
    );
  }, [subjects]);

  /* =========================================================
     SEARCH + LEVEL FILTER
  ========================================================= */

  const filteredSubjects = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return availableSubjects.filter((subject) => {
      const teacherNames = subject.teachers
        ?.map((teacher) => teacher.fullName)
        .join(" ");

      const searchableText = [
        subject.name,
        subject.code,
        subject.description,
        subject.level,
        teacherNames,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        searchableText.includes(searchTerm);

      const normalizedLevel =
        subject.level.toLowerCase() === "primary"
          ? "Primary"
          : "Secondary";

      const matchesLevel =
        selectedLevel === "All" ||
        normalizedLevel === selectedLevel;

      return matchesSearch && matchesLevel;
    });
  }, [
    availableSubjects,
    search,
    selectedLevel,
  ]);

  /* =========================================================
     EXPAND / COLLAPSE DETAILS
  ========================================================= */

  const toggleDetails = (subjectId: number) => {
    setExpandedSubject((current) =>
      current === subjectId ? null : subjectId
    );
  };

  /* =========================================================
     RESET
  ========================================================= */

  const resetSearch = () => {
    setSearch("");
    setSelectedLevel("All");
    setExpandedSubject(null);
  };

  return (
    <div className="subjects-page">
      <Navbar />

      <main>
        <section className="subjects-catalogue">
          <Container>

            {/* =========================================
                CATALOGUE HEADER
            ========================================= */}

            <div className="subjects-catalogue-header">

              <div className="subjects-heading">

                <span className="catalogue-label">
                  AVAILABLE SUBJECTS
                </span>

                <h1>
                  For Primary And Secondary School
                </h1>

              </div>

              <div className="subjects-search">

                <Search size={19} />

                <input
                  type="search"
                  value={search}
                  placeholder="Search subjects..."
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

            <div className="subjects-toolbar">

              <div className="subject-level-filter">

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
                    selectedLevel === "Primary"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedLevel("Primary")
                  }
                >
                  Primary
                </button>

                <button
                  type="button"
                  className={
                    selectedLevel === "Secondary"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedLevel("Secondary")
                  }
                >
                  Secondary
                </button>

              </div>

            </div>

            {/* =========================================
                LOADING
            ========================================= */}

            {loading && (
              <div className="subjects-message">

                <BookOpen size={28} />

                <h3>
                  Loading subjects...
                </h3>

                <p>
                  Please wait while we load the
                  available subjects.
                </p>

              </div>
            )}

            {/* =========================================
                ERROR
            ========================================= */}

            {!loading && error && (
              <div className="subjects-message error">

                <h3>
                  Unable to Load Subjects
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
                SUBJECT LIST
            ========================================= */}

            {!loading &&
              !error &&
              filteredSubjects.length > 0 && (
                <div className="subject-list">

                  {filteredSubjects.map((subject) => {

                    const isExpanded =
                      expandedSubject === subject.id;

                    const activeTeachers =
                      (subject.teachers || []).filter(
                        (teacher) =>
                          teacher.status.toLowerCase() ===
                          "active"
                      );

                    return (
                      <article
                        className={
                          isExpanded
                            ? "subject-row expanded"
                            : "subject-row"
                        }
                        key={subject.id}
                      >

                        {/* =================================
                            MAIN SUBJECT ROW
                        ================================= */}

                        <div className="subject-row-main">

                          <h2>
                            {subject.name}
                          </h2>

                          <div className="subject-row-actions">

                            {/* DETAILS */}

                            <button
                              type="button"
                              className="details-button"
                              onClick={() =>
                                toggleDetails(
                                  subject.id
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
                                <ChevronUp size={17} />
                              ) : (
                                <ChevronDown size={17} />
                              )}
                            </button>

                            {/* REGISTER */}

                            <Link
                              to={`/subscriptions?subjectId=${subject.id}`}
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
                          <div className="subject-details">

                            {/* DESCRIPTION */}

                            <div className="subject-description">

                              <span>
                                Description
                              </span>

                              <p>
                                {subject.description ||
                                  "No description available for this subject."}
                              </p>

                            </div>

                            {/* DETAILS GRID */}

                            <div className="subject-detail-grid">

                              <div className="detail-item">

                                <span>
                                  Level
                                </span>

                                <strong>
                                  {subject.level
                                    .charAt(0)
                                    .toUpperCase() +
                                    subject.level.slice(1)}
                                </strong>

                              </div>

                              <div className="detail-item">

                                <span>
                                  Subject Code
                                </span>

                                <strong>
                                  {subject.code}
                                </strong>

                              </div>

                              <div className="detail-item">

                                <span>
                                  Status
                                </span>

                                <strong>
                                  {subject.status
                                    .charAt(0)
                                    .toUpperCase() +
                                    subject.status.slice(1)}
                                </strong>

                              </div>

                              <div className="detail-item">

                                <span>
                                  Teachers
                                </span>

                                <strong>
                                  {activeTeachers.length}
                                </strong>

                              </div>

                            </div>

                            {/* TEACHERS */}

                            <div className="subject-teachers">

                              <span>
                                Teachers
                              </span>

                              {activeTeachers.length > 0 ? (
                                <div className="teacher-list">

                                  {activeTeachers.map(
                                    (teacher) => (
                                      <div
                                        className="teacher-item"
                                        key={teacher.id}
                                      >

                                        <strong>
                                          {teacher.fullName}
                                        </strong>

                                        {teacher.bio && (
                                          <p>
                                            {teacher.bio}
                                          </p>
                                        )}

                                        <small>
                                          {teacher.email}
                                        </small>

                                      </div>
                                    )
                                  )}

                                </div>
                              ) : (
                                <p className="no-teacher">
                                  Teacher details will be
                                  provided upon registration.
                                </p>
                              )}

                            </div>

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
              filteredSubjects.length === 0 && (
                <div className="subjects-message">

                  <Search size={28} />

                  <h3>
                    No subjects found
                  </h3>

                  <p>
                    No primary or secondary subject
                    matches your search.
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

export default Subjects;

