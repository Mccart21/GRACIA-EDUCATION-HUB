import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Code2,
  Factory,
  FileText,
  GraduationCap,
  Laptop,
  Palette,
  Sprout,
  Users,
  PlayCircle,
  Award,
  Target,
  BookMarked,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";

import "./CourseDetails.scss";

/* ============================================================
   API
============================================================ */

const API_BASE_URL = "http://localhost:3000/api";

/* ============================================================
   TYPES
============================================================ */

type Course = {
  id: number;
  title: string;
  description: string;
  level: string;
  category: string;
  duration: string;
  lessons: number;
  icon?: string;
  keywords?: string[] | string;
};

/* ============================================================
   ICON
============================================================ */

const getCourseIcon = (icon?: string) => {
  switch (icon?.toLowerCase()) {
    case "graduation":
      return <GraduationCap size={42} />;

    case "laptop":
      return <Laptop size={42} />;

    case "palette":
      return <Palette size={42} />;

    case "data":
      return <BarChart3 size={42} />;

    case "code":
      return <Code2 size={42} />;

    case "business":
      return <BriefcaseBusiness size={42} />;

    case "agriculture":
      return <Sprout size={42} />;

    case "factory":
      return <Factory size={42} />;

    case "career":
      return <FileText size={42} />;

    default:
      return <BookOpen size={42} />;
  }
};

/* ============================================================
   COURSE DETAILS PAGE
============================================================ */

const CourseDetails = () => {
  const navigate = useNavigate();

  const { courseId: rawId } = useParams<{
    courseId: string;
  }>();

  const courseId = rawId ? Number(rawId.trim()) : NaN;

  const [course, setCourse] = useState<Course | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================================
     ENROLLMENT STATE
  ========================================================== */

  const [enrolled, setEnrolled] = useState(false);

  /* ==========================================================
     FETCH COURSE
  ========================================================== */

  useEffect(() => {
    const fetchCourse = async () => {
      if (!Number.isInteger(courseId)) {
        setError("Invalid course ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [courseResponse, coursesResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/courses/${courseId}`),
            fetch(`${API_BASE_URL}/courses`),
          ]);

        if (!courseResponse.ok) {
          if (courseResponse.status === 404) {
            setCourse(null);
            setError("");
            return;
          }

          throw new Error("Failed to load course.");
        }

        if (!coursesResponse.ok) {
          throw new Error("Failed to load courses.");
        }

        const courseData: Course =
          await courseResponse.json();

        const coursesData: Course[] =
          await coursesResponse.json();

        setCourse(courseData);
        setAllCourses(coursesData);
      } catch (err) {
        console.error("Course details error:", err);

        setError(
          "Unable to load this course. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  /* ==========================================================
     CHECK EXISTING ENROLLMENT
  ========================================================== */

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!Number.isInteger(courseId)) {
        return;
      }

      const token = localStorage.getItem("gracia_token");

      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/enrollments/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data) {
            setEnrolled(true);
          }
        }

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem("gracia_token");
          setEnrolled(false);
        }
      } catch (err) {
        console.error(
          "Enrollment check error:",
          err
        );
      }
    };

    checkEnrollment();
  }, [courseId]);

  /* ==========================================================
     ENROLL / CONTINUE TO SUBSCRIPTION
  ========================================================== */

  const handleEnroll = () => {
    if (!course) {
      return;
    }

    /*
      Save the selected course temporarily.

      This allows the subscription page and later
      registration/login flow to know which course
      the student selected.
    */

    localStorage.setItem(
      "gracia_pending_course",
      JSON.stringify({
        courseId: course.id,
        title: course.title,
      })
    );

    /*
      Go directly to the subscription page.

      Example:
      /subscriptions?courseId=7
    */

    navigate(
      `/subscriptions?courseId=${course.id}`
    );
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="course-details-page">
        <Navbar />

        <main className="course-not-found">
          <Container>
            <div className="not-found-card">
              <div className="not-found-icon">
                <BookOpen size={34} />
              </div>

              <span>
                GRACIA EDUCATION HUB
              </span>

              <h1>
                Loading Course...
              </h1>

              <p>
                Please wait while we load the
                course information.
              </p>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <div className="course-details-page">
        <Navbar />

        <main className="course-not-found">
          <Container>
            <div className="not-found-card">
              <div className="not-found-icon">
                <BookOpen size={34} />
              </div>

              <span>
                GRACIA EDUCATION HUB
              </span>

              <h1>
                Unable to Load Course
              </h1>

              <p>{error}</p>

              <Link
                to="/courses"
                className="back-courses-button"
              >
                <ArrowLeft size={17} />
                Back to Courses
              </Link>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    );
  }

  /* ==========================================================
     COURSE NOT FOUND
  ========================================================== */

  if (!course) {
    return (
      <div className="course-details-page">
        <Navbar />

        <main className="course-not-found">
          <Container>
            <div className="not-found-card">
              <div className="not-found-icon">
                <BookOpen size={34} />
              </div>

              <span>
                GRACIA EDUCATION HUB
              </span>

              <h1>
                Course Not Found
              </h1>

              <p>
                The course you are looking for
                could not be found. Please return
                to the course catalog and choose
                another program.
              </p>

              <Link
                to="/courses"
                className="back-courses-button"
              >
                <ArrowLeft size={17} />
                Back to Courses
              </Link>
            </div>
          </Container>
        </main>

        <Footer />
      </div>
    );
  }

  /* ==========================================================
     RELATED COURSES
  ========================================================== */

  const relatedCourses = allCourses
    .filter(
      (item) =>
        item.id !== course.id &&
        item.level === course.level
    )
    .slice(0, 3);

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <div className="course-details-page">
      <Navbar />

      <main>

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="course-details-hero">
          <Container>

            {/* BREADCRUMB */}

            <div className="details-breadcrumb">
              <Link to="/courses">
                <ArrowLeft size={15} />
                All Courses
              </Link>

              <span>/</span>

              <span>
                {course.level}
              </span>

              <span>/</span>

              <span>
                {course.category}
              </span>
            </div>

            {/* HERO CONTENT */}

            <div className="details-hero-content">

              <div className="details-main">

                <div className="details-icon">
                  {getCourseIcon(course.icon)}
                </div>

                <div className="details-category">
                  {course.category}
                </div>

                <h1>
                  {course.title}
                </h1>

                <p className="details-description">
                  {course.description}
                </p>

                <div className="details-trust">

                  <span>
                    <CheckCircle2 size={17} />
                    Quality Learning
                  </span>

                  <span>
                    <CheckCircle2 size={17} />
                    Flexible Learning
                  </span>

                  <span>
                    <CheckCircle2 size={17} />
                    Practical Support
                  </span>

                </div>

                {/* =================================================
                    ENROLLMENT ACTION
                ================================================= */}

                <div className="course-enrollment-action">

                  <button
                    type="button"
                    className="enroll-button"
                    onClick={handleEnroll}
                  >
                    {enrolled ? (
                      <>
                        <CheckCircle2 size={18} />
                        Continue to Subscription
                      </>
                    ) : (
                      <>
                        Enroll Now
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                </div>

              </div>

              {/* SUMMARY */}

              <div className="course-summary-card">

                <div className="summary-label">
                  COURSE OVERVIEW
                </div>

                <h2>
                  Start building your
                  <span>
                    knowledge & skills.
                  </span>
                </h2>

                <div className="summary-items">

                  <div className="summary-item">

                    <div>
                      <Clock3 size={19} />
                    </div>

                    <span>
                      Duration
                    </span>

                    <strong>
                      {course.duration}
                    </strong>

                  </div>

                  <div className="summary-item">

                    <div>
                      <BookOpen size={19} />
                    </div>

                    <span>
                      Lessons
                    </span>

                    <strong>
                      {course.lessons}
                    </strong>

                  </div>

                  <div className="summary-item">

                    <div>
                      <GraduationCap size={19} />
                    </div>

                    <span>
                      Level
                    </span>

                    <strong>
                      {course.level}
                    </strong>

                  </div>

                </div>

                <div className="summary-price">

                  <span>
                    COURSE PRICING
                  </span>

                  <strong>
                    Flexible Rates
                  </strong>

                  <small>
                    Contact us for current
                    pricing and learning
                    arrangements.
                  </small>

                </div>

                <Link
                  to="/contact"
                  className="contact-course"
                >
                  Contact us about this
                  course
                </Link>

              </div>

            </div>
          </Container>
        </section>

        {/* ====================================================
            COURSE INFORMATION
        ==================================================== */}

        <section className="course-information">
          <Container>

            <div className="information-layout">

              {/* MAIN */}

              <div className="information-main">

                <div className="information-heading">

                  <span>
                    ABOUT THIS PROGRAM
                  </span>

                  <h2>
                    Learn with purpose.
                  </h2>

                </div>

                <p className="large-description">
                  {course.description}
                </p>

                <p>
                  This learning program is
                  designed to provide structured
                  knowledge, practical
                  understanding and useful
                  skills appropriate for learners
                  at the{" "}
                  {course.level.toLowerCase()}{" "}
                  level.
                </p>

                {/* OUTCOMES */}

                <div className="learning-outcomes">

                  <div className="outcomes-heading">

                    <Target size={22} />

                    <div>

                      <span>
                        WHAT YOU WILL GAIN
                      </span>

                      <h3>
                        Learning Outcomes
                      </h3>

                    </div>

                  </div>

                  <div className="outcomes-grid">

                    <div className="outcome-card">

                      <CheckCircle2 />

                      <h4>
                        Strong Foundations
                      </h4>

                      <p>
                        Build a clear
                        understanding of
                        important concepts
                        and principles.
                      </p>

                    </div>

                    <div className="outcome-card">

                      <CheckCircle2 />

                      <h4>
                        Practical Knowledge
                      </h4>

                      <p>
                        Connect what you
                        learn with practical
                        applications and
                        real-world situations.
                      </p>

                    </div>

                    <div className="outcome-card">

                      <CheckCircle2 />

                      <h4>
                        Greater Confidence
                      </h4>

                      <p>
                        Develop confidence
                        to apply your
                        knowledge in
                        education, work or
                        personal development.
                      </p>

                    </div>

                    <div className="outcome-card">

                      <CheckCircle2 />

                      <h4>
                        Flexible Progress
                      </h4>

                      <p>
                        Learn progressively
                        at a pace that works
                        for your learning
                        needs.
                      </p>

                    </div>

                  </div>
                </div>

                {/* FEATURES */}

                <div className="course-features">

                  <div className="feature-heading">

                    <BookMarked size={22} />

                    <div>

                      <span>
                        PROGRAM FEATURES
                      </span>

                      <h3>
                        Designed Around You
                      </h3>

                    </div>

                  </div>

                  <div className="features-list">

                    <div>
                      <CheckCircle2 />
                      <span>
                        Structured learning
                        content
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Flexible learning
                        arrangements
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Practical examples
                        and applications
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Support for different
                        learning needs
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Knowledge and skills
                        development
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Learning focused on
                        real outcomes
                      </span>
                    </div>

                  </div>

                </div>

              </div>

              {/* SIDEBAR */}

              <aside className="course-sidebar">

                <div className="sidebar-card">

                  <div className="sidebar-icon">
                    <PlayCircle size={27} />
                  </div>

                  <span>
                    READY TO LEARN?
                  </span>

                  <h3>
                    Take the next step.
                  </h3>

                  <p>
                    Register with Gracia
                    Education Hub and begin
                    your learning journey.
                  </p>

                  <Link
                    to="/register"
                    className="sidebar-button"
                  >
                    Create Account
                    <ArrowRight size={16} />
                  </Link>

                </div>

                <div className="support-card">

                  <div className="support-icon">
                    <Users size={21} />
                  </div>

                  <div>

                    <span>
                      NEED HELP?
                    </span>

                    <strong>
                      Talk to Gracia
                    </strong>

                    <Link to="/contact">
                      Contact Support
                      <ArrowRight size={14} />
                    </Link>

                  </div>

                </div>

                <div className="benefit-card">

                  <Award size={24} />

                  <div>

                    <strong>
                      Knowledge with Purpose
                    </strong>

                    <p>
                      Learn skills that can
                      make a meaningful
                      difference in your future.
                    </p>

                  </div>

                </div>

              </aside>

            </div>
          </Container>
        </section>

        {/* ====================================================
            RELATED COURSES
        ==================================================== */}

        {relatedCourses.length > 0 && (
          <section className="related-courses">

            <Container>

              <div className="related-heading">

                <div>

                  <span>
                    YOU MAY ALSO LIKE
                  </span>

                  <h2>
                    More {course.level} Programs
                  </h2>

                </div>

                <Link
                  to={`/courses?level=${encodeURIComponent(
                    course.level.toLowerCase()
                  )}`}
                >
                  View All
                  <ArrowRight size={16} />
                </Link>

              </div>

              <div className="related-grid">

                {relatedCourses.map(
                  (related) => (
                    <article
                      className="related-card"
                      key={related.id}
                    >

                      <div className="related-icon">
                        {getCourseIcon(
                          related.icon
                        )}
                      </div>

                      <span>
                        {related.category}
                      </span>

                      <h3>
                        {related.title}
                      </h3>

                      <p>
                        {related.description}
                      </p>

                      <div className="related-bottom">

                        <small>
                          <BookOpen size={14} />
                          {related.lessons}{" "}
                          lessons
                        </small>

                        <Link
                          to={`/courses/${related.id}`}
                        >
                          Explore
                          <ArrowRight
                            size={15}
                          />
                        </Link>

                      </div>

                    </article>
                  )
                )}

              </div>
            </Container>

          </section>
        )}

        {/* ====================================================
            CTA
        ==================================================== */}

        <section className="details-cta">

          <Container>

            <div className="details-cta-inner">

              <div>

                <span>
                  GRACIA EDUCATION HUB
                </span>

                <h2>
                  Ready to Start Learning?
                </h2>

                <p>
                  Take the next step and begin
                  building knowledge and
                  practical skills for your
                  future.
                </p>

              </div>

              <div className="details-cta-actions">

                <Link
                  to="/register"
                  className="details-cta-primary"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/courses"
                  className="details-cta-secondary"
                >
                  Explore Courses
                </Link>

              </div>

            </div>

          </Container>

        </section>

      </main>

      <Footer />
    </div>
  );
};

export default CourseDetails;