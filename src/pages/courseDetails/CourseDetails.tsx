
import { Link, useParams } from "react-router-dom";
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
   TYPES
============================================================ */

type CourseLevel =
  | "Primary"
  | "Secondary"
  | "Tertiary"
  | "Practical Skills";

type CourseIcon =
  | "book"
  | "graduation"
  | "laptop"
  | "palette"
  | "data"
  | "code"
  | "business"
  | "agriculture"
  | "factory"
  | "career";

interface Course {
  id: number;
  title: string;
  description: string;
  level: CourseLevel;
  category: string;
  duration: string;
  lessons: number;
  icon: CourseIcon;
  keywords: string[];
}

/* ============================================================
   COURSE DATA
============================================================ */

const courses: Course[] = [
  /* ============================================================
     PRIMARY
  ============================================================ */

  {
    id: 1,
    title: "Primary English",
    description:
      "Build strong communication, reading, writing, grammar and language skills for primary learners.",
    level: "Primary",
    category: "English",
    duration: "Flexible",
    lessons: 20,
    icon: "book",
    keywords: [
      "english",
      "primary",
      "reading",
      "writing",
      "grammar",
      "language",
    ],
  },

  {
    id: 2,
    title: "Primary Mathematics",
    description:
      "Develop strong mathematical foundations through structured and practical learning.",
    level: "Primary",
    category: "Mathematics",
    duration: "Flexible",
    lessons: 24,
    icon: "book",
    keywords: [
      "maths",
      "mathematics",
      "primary",
      "numbers",
      "calculation",
    ],
  },

  {
    id: 3,
    title: "Primary Science",
    description:
      "Explore essential science concepts and develop a strong foundation for further studies.",
    level: "Primary",
    category: "Science",
    duration: "Flexible",
    lessons: 22,
    icon: "book",
    keywords: [
      "science",
      "primary",
      "environment",
      "biology",
    ],
  },

  {
    id: 4,
    title: "Primary Agriculture",
    description:
      "Learn essential agricultural concepts and practical knowledge for primary learners.",
    level: "Primary",
    category: "Agriculture",
    duration: "Flexible",
    lessons: 18,
    icon: "agriculture",
    keywords: [
      "agriculture",
      "farming",
      "crops",
      "primary",
    ],
  },

  /* ============================================================
     SECONDARY
  ============================================================ */

  {
    id: 5,
    title: "Secondary English",
    description:
      "Strengthen English language, communication, comprehension and writing skills for secondary learners.",
    level: "Secondary",
    category: "English",
    duration: "Flexible",
    lessons: 24,
    icon: "graduation",
    keywords: [
      "english",
      "secondary",
      "writing",
      "grammar",
      "communication",
    ],
  },

  {
    id: 6,
    title: "Secondary Mathematics",
    description:
      "Master important mathematical concepts and build confidence for secondary school examinations.",
    level: "Secondary",
    category: "Mathematics",
    duration: "Flexible",
    lessons: 30,
    icon: "graduation",
    keywords: [
      "maths",
      "mathematics",
      "secondary",
      "examinations",
    ],
  },

  {
    id: 7,
    title: "Secondary Physics",
    description:
      "Understand physics concepts through structured lessons, examples and practical applications.",
    level: "Secondary",
    category: "Physics",
    duration: "Flexible",
    lessons: 30,
    icon: "graduation",
    keywords: [
      "physics",
      "secondary",
      "science",
      "experiments",
    ],
  },

  {
    id: 8,
    title: "Secondary Biology",
    description:
      "Develop a deeper understanding of living organisms, biological systems and related concepts.",
    level: "Secondary",
    category: "Biology",
    duration: "Flexible",
    lessons: 30,
    icon: "graduation",
    keywords: [
      "biology",
      "secondary",
      "science",
      "living organisms",
    ],
  },

  {
    id: 9,
    title: "Secondary Chemistry",
    description:
      "Learn fundamental chemistry concepts and develop the knowledge needed for further study.",
    level: "Secondary",
    category: "Chemistry",
    duration: "Flexible",
    lessons: 30,
    icon: "graduation",
    keywords: [
      "chemistry",
      "secondary",
      "science",
      "laboratory",
    ],
  },

  {
    id: 10,
    title: "Secondary Agriculture",
    description:
      "Build practical and academic knowledge in agriculture, crop production and related areas.",
    level: "Secondary",
    category: "Agriculture",
    duration: "Flexible",
    lessons: 24,
    icon: "agriculture",
    keywords: [
      "agriculture",
      "secondary",
      "farming",
      "crops",
      "livestock",
    ],
  },

  /* ============================================================
     TERTIARY
  ============================================================ */

  {
    id: 11,
    title: "University Entrance & On-Course Training",
    description:
      "Preparation and academic support for university entrance and students already undertaking university studies.",
    level: "Tertiary",
    category: "University Support",
    duration: "Flexible",
    lessons: 30,
    icon: "graduation",
    keywords: [
      "university",
      "tertiary",
      "entrance",
      "students",
      "on-course",
      "academic",
    ],
  },

  {
    id: 12,
    title: "Professional Proposal & Research Writing",
    description:
      "Develop practical skills for preparing professional proposals, academic work and research documents.",
    level: "Tertiary",
    category: "Research",
    duration: "Flexible",
    lessons: 20,
    icon: "career",
    keywords: [
      "proposal",
      "research",
      "writing",
      "professional",
      "academic",
    ],
  },

  {
    id: 13,
    title: "Data Analysis",
    description:
      "Learn practical data analysis using tools such as Stata, SPSS, KoboToolbox, Power BI and GenStat.",
    level: "Tertiary",
    category: "Data Analysis",
    duration: "Flexible",
    lessons: 28,
    icon: "data",
    keywords: [
      "data",
      "analysis",
      "stata",
      "spss",
      "kobotoolbox",
      "powerbi",
      "power bi",
      "genstat",
      "statistics",
    ],
  },

  {
    id: 14,
    title: "Programming with R & Java",
    description:
      "Develop practical programming knowledge using R and Java for academic and professional applications.",
    level: "Tertiary",
    category: "Programming",
    duration: "Flexible",
    lessons: 30,
    icon: "code",
    keywords: [
      "programming",
      "r",
      "java",
      "software",
      "coding",
      "technology",
    ],
  },

  /* ============================================================
     PRACTICAL SKILLS
  ============================================================ */

  {
    id: 15,
    title: "Computer Basics",
    description:
      "Build essential computer skills for education, work, business and everyday digital activities.",
    level: "Practical Skills",
    category: "Digital Skills",
    duration: "Flexible",
    lessons: 15,
    icon: "laptop",
    keywords: [
      "computer",
      "basics",
      "digital",
      "technology",
      "ict",
    ],
  },

  {
    id: 16,
    title: "Software Packages",
    description:
      "Learn how to understand and work with different software packages used in education and professional environments.",
    level: "Practical Skills",
    category: "Digital Skills",
    duration: "Flexible",
    lessons: 18,
    icon: "laptop",
    keywords: [
      "software",
      "packages",
      "computer",
      "digital",
      "office",
    ],
  },

  {
    id: 17,
    title: "CV Writing & Job Applications",
    description:
      "Get practical support with CV writing, job applications, interviews and professional applications.",
    level: "Practical Skills",
    category: "Career Development",
    duration: "Flexible",
    lessons: 12,
    icon: "career",
    keywords: [
      "cv",
      "curriculum vitae",
      "job",
      "application",
      "interview",
      "career",
      "employment",
    ],
  },

  {
    id: 18,
    title: "Crop Production & Animal Rearing",
    description:
      "Learn practical approaches to growing crops and rearing animals for personal, community and business development.",
    level: "Practical Skills",
    category: "Agriculture",
    duration: "Flexible",
    lessons: 20,
    icon: "agriculture",
    keywords: [
      "crops",
      "farming",
      "agriculture",
      "animals",
      "animal rearing",
      "livestock",
    ],
  },

  {
    id: 19,
    title: "Manufacturing",
    description:
      "Explore practical manufacturing knowledge and skills for productive and entrepreneurial activities.",
    level: "Practical Skills",
    category: "Manufacturing",
    duration: "Flexible",
    lessons: 18,
    icon: "factory",
    keywords: [
      "manufacturing",
      "production",
      "business",
      "industry",
    ],
  },

  {
    id: 20,
    title: "Photoshop Designing",
    description:
      "Develop practical graphic design skills using Photoshop for creative and professional work.",
    level: "Practical Skills",
    category: "Design",
    duration: "Flexible",
    lessons: 20,
    icon: "palette",
    keywords: [
      "photoshop",
      "design",
      "graphic design",
      "graphics",
      "creative",
    ],
  },

  {
    id: 21,
    title: "Entrepreneurship",
    description:
      "Develop entrepreneurial thinking and practical knowledge for starting and growing business opportunities.",
    level: "Practical Skills",
    category: "Business",
    duration: "Flexible",
    lessons: 18,
    icon: "business",
    keywords: [
      "entrepreneurship",
      "business",
      "enterprise",
      "startup",
    ],
  },

  {
    id: 22,
    title: "Investment & Business Management",
    description:
      "Learn practical principles of investment, financial decision-making and business management.",
    level: "Practical Skills",
    category: "Business",
    duration: "Flexible",
    lessons: 20,
    icon: "business",
    keywords: [
      "investment",
      "business",
      "management",
      "finance",
      "entrepreneurship",
    ],
  },

  {
    id: 23,
    title: "Monitoring & Evaluation",
    description:
      "Build practical knowledge in monitoring, evaluation, reporting and assessing project performance.",
    level: "Practical Skills",
    category: "Monitoring & Evaluation",
    duration: "Flexible",
    lessons: 18,
    icon: "data",
    keywords: [
      "monitoring",
      "evaluation",
      "m&e",
      "projects",
      "reporting",
      "data",
    ],
  },

  {
    id: 24,
    title: "Nutrition",
    description:
      "Learn practical nutrition concepts that support healthy individuals, families and communities.",
    level: "Practical Skills",
    category: "Nutrition",
    duration: "Flexible",
    lessons: 16,
    icon: "book",
    keywords: [
      "nutrition",
      "food",
      "health",
      "community",
    ],
  },
];

/* ============================================================
   ICON
============================================================ */

const getCourseIcon = (icon: CourseIcon) => {
  switch (icon) {
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
  /*
   * IMPORTANT:
   * AppRoutes.tsx uses:
   *
   * /courses/:courseId
   *
   * Therefore we MUST read "courseId" here.
   */

  const { courseId: rawId } = useParams<{
    courseId: string;
  }>();

  /*
   * Convert the URL parameter into a number.
   *
   * Example:
   * /courses/1
   *
   * rawId = "1"
   * courseId = 1
   */

  const courseId = rawId
    ? Number(rawId.trim())
    : NaN;

  const course = courses.find(
    (item) => item.id === courseId
  );

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
                The course you are looking for could
                not be found. Please return to our
                course catalog and choose another
                program.
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

  const relatedCourses = courses
    .filter(
      (item) =>
        item.id !== course.id &&
        item.level === course.level
    )
    .slice(0, 3);

  return (
    <div className="course-details-page">

      <Navbar />

      <main>

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="course-details-hero">

          <div className="course-details-background">

            <div className="details-glow details-glow-one" />

            <div className="details-glow details-glow-two" />

            <div className="details-grid" />

          </div>

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

              </div>

              {/* SUMMARY CARD */}

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
                    Contact us for current pricing
                    and learning arrangements.
                  </small>

                </div>

                <Link
                  to="/register"
                  className="enroll-button"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/contact"
                  className="contact-course"
                >
                  Contact us about this course
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
                  This learning program is designed
                  to provide structured knowledge,
                  practical understanding and useful
                  skills appropriate for learners at
                  the {course.level.toLowerCase()} level.
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
                        Build a clear understanding
                        of important concepts and
                        principles.
                      </p>

                    </div>

                    <div className="outcome-card">

                      <CheckCircle2 />

                      <h4>
                        Practical Knowledge
                      </h4>

                      <p>
                        Connect what you learn with
                        practical applications and
                        real-world situations.
                      </p>

                    </div>

                    <div className="outcome-card">

                      <CheckCircle2 />

                      <h4>
                        Greater Confidence
                      </h4>

                      <p>
                        Develop confidence to apply
                        your knowledge in education,
                        work or personal development.
                      </p>

                    </div>

                    <div className="outcome-card">

                      <CheckCircle2 />

                      <h4>
                        Flexible Progress
                      </h4>

                      <p>
                        Learn progressively at a pace
                        that works for your learning
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
                        Structured learning content
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Flexible learning arrangements
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Practical examples and applications
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Support for different learning needs
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Knowledge and skills development
                      </span>
                    </div>

                    <div>
                      <CheckCircle2 />
                      <span>
                        Learning focused on real outcomes
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
                    Register with Gracia Education
                    Hub and begin your learning
                    journey.
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
                      Learn skills that can make
                      a meaningful difference in
                      your future.
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
                  to={`/courses?level=${course.level.toLowerCase()}`}
                >
                  View All
                  <ArrowRight size={16} />
                </Link>

              </div>

              <div className="related-grid">

                {relatedCourses.map((related) => (

                  <article
                    className="related-card"
                    key={related.id}
                  >

                    <div className="related-icon">

                      {getCourseIcon(related.icon)}

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

                        {related.lessons} lessons

                      </small>

                      <Link
                        to={`/courses/${related.id}`}
                      >

                        Explore

                        <ArrowRight size={15} />

                      </Link>

                    </div>

                  </article>

                ))}

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
                  building knowledge and practical
                  skills for your future.
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
