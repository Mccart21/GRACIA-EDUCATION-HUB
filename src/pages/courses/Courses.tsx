import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Laptop,
  Palette,
  Search,
  SlidersHorizontal,
  Sprout,
  X,
  BarChart3,
  Code2,
  Factory,
  FileText,
  Users,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";


import "./Courses.scss";

type CourseLevel =
  | "All"
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
  level: Exclude<CourseLevel, "All">;
  category: string;
  duration: string;
  lessons: number;
  icon: CourseIcon;
  keywords: string[];
  buttonLabel?: string;
}

/* ============================================================
   GRACIA EDUCATION HUB PROGRAMS
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
     TERTIARY / UNIVERSITY / PROFESSIONAL
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

const levels: CourseLevel[] = [
  "All",
  "Primary",
  "Secondary",
  "Tertiary",
  "Practical Skills",
];

const categories = [
  "All",
  "English",
  "Mathematics",
  "Science",
  "Physics",
  "Biology",
  "Chemistry",
  "Agriculture",
  "University Support",
  "Research",
  "Data Analysis",
  "Programming",
  "Digital Skills",
  "Career Development",
  "Manufacturing",
  "Design",
  "Business",
  "Monitoring & Evaluation",
  "Nutrition",
];

const Courses = () => {
  const [searchParams] = useSearchParams();

  const initialLevel =
    searchParams.get("level")?.toLowerCase() || "all";

  const initialCategory =
    searchParams.get("category")?.toLowerCase() || "all";

  const [search, setSearch] = useState("");

  const [selectedLevel, setSelectedLevel] =
    useState<CourseLevel>(
      initialLevel === "primary"
        ? "Primary"
        : initialLevel === "secondary"
        ? "Secondary"
        : initialLevel === "tertiary"
        ? "Tertiary"
        : initialCategory === "skills"
        ? "Practical Skills"
        : "All"
    );

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [mobileFilters, setMobileFilters] =
    useState(false);

  /* ============================================================
     SEARCH + FILTER
  ============================================================ */

  const filteredCourses = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return courses.filter((course) => {
      const searchableText = [
        course.title,
        course.description,
        course.level,
        course.category,
        ...course.keywords,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        searchableText.includes(searchTerm);

      const matchesLevel =
        selectedLevel === "All" ||
        course.level === selectedLevel;

      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      return (
        matchesSearch &&
        matchesLevel &&
        matchesCategory
      );
    });
  }, [
    search,
    selectedLevel,
    selectedCategory,
  ]);

  /* ============================================================
     ICONS
  ============================================================ */

  const getCourseIcon = (
    icon: CourseIcon
  ) => {
    switch (icon) {
      case "graduation":
        return <GraduationCap size={27} />;

      case "laptop":
        return <Laptop size={27} />;

      case "palette":
        return <Palette size={27} />;

      case "data":
        return <BarChart3 size={27} />;

      case "code":
        return <Code2 size={27} />;

      case "business":
        return <BriefcaseBusiness size={27} />;

      case "agriculture":
        return <Sprout size={27} />;

      case "factory":
        return <Factory size={27} />;

      case "career":
        return <FileText size={27} />;

      default:
        return <BookOpen size={27} />;
    }
  };

  const getButtonLabel = (
    course: Course
  ) => {
    if (
      course.level === "Primary" ||
      course.level === "Secondary"
    ) {
      return "View Subject";
    }

    return "View Course";
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedLevel("All");
    setSelectedCategory("All");
    setMobileFilters(false);
  };

  return (
    <div className="courses-page">

      <Navbar />

      <main>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="courses-hero">

          <div className="courses-hero-background">
            <div className="courses-glow courses-glow-one" />
            <div className="courses-glow courses-glow-two" />
            <div className="courses-grid-pattern" />
            <div className="courses-circle courses-circle-one" />
            <div className="courses-circle courses-circle-two" />
          </div>

          <Container>

            <div className="courses-hero-content">

              <div className="courses-hero-text">

                <span className="courses-eyebrow">
                  GRACIA EDUCATION HUB
                </span>

                <h1>
                  Learn With Purpose.
                  <span>
                    Grow With Action.
                  </span>
                </h1>

                <p>
                  Affordable, quality education and
                  practical training for primary,
                  secondary, tertiary, professional
                  and lifelong learners.
                </p>

                <div className="courses-hero-trust">

                  <span>
                    <CheckCircle2 size={17} />
                    Affordable Prices
                  </span>

                  <span>
                    <CheckCircle2 size={17} />
                    Flexible Rates
                  </span>

                  <span>
                    <CheckCircle2 size={17} />
                    All Learning Levels
                  </span>

                </div>

                {/* SEARCH */}

                <div className="course-search">

                  <Search size={21} />

                  <input
                    type="search"
                    value={search}
                    placeholder="Search subjects, courses, skills or software..."
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      aria-label="Clear search"
                    >
                      <X size={18} />
                    </button>
                  )}

                </div>

                {search && (
                  <div className="search-result-message">
                    Searching for:
                    <strong>
                      {" "}
                      {search}
                    </strong>
                  </div>
                )}

              </div>

              <div className="courses-hero-card">

               


                
                

                <div className="hero-stream-list">

                 

                </div>


              </div>

            </div>

          </Container>

        </section>

        {/* =====================================================
            PROGRAM STREAMS
        ===================================================== */}

        <section className="program-streams">

          <Container>

            <div className="section-heading">

              <span>
                PROGRAM STREAMS
              </span>

              <h2>
                Something for Every Learner
              </h2>

              <p>
                Choose the learning path that
                matches where you are and where
                you want to go.
              </p>

            </div>

            <div className="stream-grid">

              <Link
                to="/courses?level=primary"
                className="stream-card"
              >

                <div className="stream-icon">
                  <BookOpen />
                </div>

                <div className="stream-card-content">

                  <span>
                    PRIMARY
                  </span>

                  <h3>
                    Primary Education
                  </h3>

                  <p>
                    English, Mathematics, Science
                    and Agriculture for primary
                    learners.
                  </p>

                  <strong>
                    View Subjects
                    <ArrowRight size={16} />
                  </strong>

                </div>

              </Link>

              <Link
                to="/courses?level=secondary"
                className="stream-card"
              >

                <div className="stream-icon">
                  <GraduationCap />
                </div>

                <div className="stream-card-content">

                  <span>
                    SECONDARY
                  </span>

                  <h3>
                    Secondary Education
                  </h3>

                  <p>
                    English, Mathematics, Physics,
                    Biology, Chemistry and Agriculture.
                  </p>

                  <strong>
                    View Subjects
                    <ArrowRight size={16} />
                  </strong>

                </div>

              </Link>

              <Link
                to="/courses?level=tertiary"
                className="stream-card"
              >

                <div className="stream-icon">
                  <Laptop />
                </div>

                <div className="stream-card-content">

                  <span>
                    TERTIARY
                  </span>

                  <h3>
                    University & Professional
                  </h3>

                  <p>
                    University entrance, on-course
                    support, research, data analysis
                    and programming.
                  </p>

                  <strong>
                    View Courses
                    <ArrowRight size={16} />
                  </strong>

                </div>

              </Link>

              <Link
                to="/courses?category=skills"
                className="stream-card"
              >

                <div className="stream-icon">
                  <BriefcaseBusiness />
                </div>

                <div className="stream-card-content">

                  <span>
                    PRACTICAL SKILLS
                  </span>

                  <h3>
                    Skills & Development
                  </h3>

                  <p>
                    Digital skills, career support,
                    agriculture, design, business and
                    practical training.
                  </p>

                  <strong>
                    View Courses
                    <ArrowRight size={16} />
                  </strong>

                </div>

              </Link>

            </div>

          </Container>

        </section>

        {/* =====================================================
            COURSE CATALOG
        ===================================================== */}

        <section className="courses-section">

          <Container>

            <div className="courses-layout">

              {/* FILTERS */}

              <aside
                className={`course-filters ${
                  mobileFilters
                    ? "filters-open"
                    : ""
                }`}
              >

                <div className="filters-header">

                  <div>

                    <SlidersHorizontal
                      size={18}
                    />

                    <h3>
                      Filters
                    </h3>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setMobileFilters(false)
                    }
                    className="close-filters"
                  >
                    <X size={20} />
                  </button>

                </div>

                <div className="filter-group">

                  <h4>
                    Learning Level
                  </h4>

                  {levels.map((level) => (

                    <button
                      type="button"
                      key={level}
                      className={
                        selectedLevel === level
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() =>
                        setSelectedLevel(level)
                      }
                    >

                      <span>
                        {level}
                      </span>

                      <small>
                        {level === "All"
                          ? courses.length
                          : courses.filter(
                              (course) =>
                                course.level ===
                                level
                            ).length}
                      </small>

                    </button>

                  ))}

                </div>

                <div className="filter-group">

                  <h4>
                    Subject / Category
                  </h4>

                  {categories.map(
                    (category) => (

                      <button
                        type="button"
                        key={category}
                        className={
                          selectedCategory ===
                          category
                            ? "filter-option active"
                            : "filter-option"
                        }
                        onClick={() =>
                          setSelectedCategory(
                            category
                          )
                        }
                      >

                        <span>
                          {category}
                        </span>

                      </button>

                    )
                  )}

                </div>

                <button
                  type="button"
                  className="reset-filters"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>

              </aside>

              {/* CONTENT */}

              <div className="courses-content">

                <div className="courses-toolbar">

                  <div>

                    <span className="toolbar-label">
                      OUR PROGRAMS
                    </span>

                    <h2>
                      Available Learning
                    </h2>

                    <p>
                      {filteredCourses.length}{" "}
                      programs available
                    </p>

                  </div>

                  <button
                    type="button"
                    className="mobile-filter-button"
                    onClick={() =>
                      setMobileFilters(true)
                    }
                  >
                    <SlidersHorizontal
                      size={17}
                    />

                    Filters
                  </button>

                </div>

                {filteredCourses.length > 0 ? (

                  <div className="courses-grid">

                    {filteredCourses.map(
                      (course) => (

                        <article
                          className="course-card"
                          key={course.id}
                        >

                          <div className="course-card-top">

                            <div className="course-icon">
                              {getCourseIcon(
                                course.icon
                              )}
                            </div>

                            <span className="course-level">
                              {course.level}
                            </span>

                          </div>

                          <div className="course-card-body">

                            <span className="course-category">
                              {course.category}
                            </span>

                            <h3>
                              {course.title}
                            </h3>

                            <p>
                              {course.description}
                            </p>

                            <div className="course-meta">

                              <span>
                                <Clock3
                                  size={15}
                                />

                                {course.duration}
                              </span>

                              <span>
                                <BookOpen
                                  size={15}
                                />

                                {course.lessons}{" "}
                                lessons
                              </span>

                            </div>

                            <div className="course-footer">

                              <div className="course-price">

                                <small>
                                  Pricing
                                </small>

                                <strong>
                                  Flexible Rates
                                </strong>

                              </div>

                              <Link
                                to={`/courses/${course.id}`}
                                className="view-course"
                              >

                                {getButtonLabel(
                                  course
                                )}

                                <ArrowRight
                                  size={16}
                                />

                              </Link>

                            </div>

                          </div>

                        </article>

                      )
                    )}

                  </div>

                ) : (

                  <div className="no-courses">

                    <div>
                      <Search size={30} />
                    </div>

                    <h3>
                      No programs found
                    </h3>

                    <p>
                      We could not find a
                      subject, course or skill
                      matching your search.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                    >
                      Clear Search & Filters
                    </button>

                  </div>

                )}

              </div>

            </div>

          </Container>

        </section>

        {/* =====================================================
            PRACTICAL SKILLS
        ===================================================== */}

        <section className="skills-section">

          <Container>

            <div className="skills-wrapper">

              <div className="skills-heading">

                <span>
                  PRACTICAL SKILLS
                </span>

                <h2>
                  More Than Just
                  <span>
                    Classroom Learning
                  </span>
                </h2>

                <p>
                  We also provide practical
                  knowledge and skills that can
                  support your career, business,
                  community and personal growth.
                </p>

              </div>

              <div className="skills-list">

                <div className="skill-item">
                  <CheckCircle2 size={19} />
                  <span>
                    Computer basics
                  </span>
                </div>

                <div className="skill-item">
                  <CheckCircle2 size={19} />
                  <span>
                    Understanding different
                    software packages
                  </span>
                </div>

                <div className="skill-item">
                  <CheckCircle2 size={19} />
                  <span>
                    CV writing, interviews and
                    job applications
                  </span>
                </div>

                <div className="skill-item">
                  <CheckCircle2 size={19} />
                  <span>
                    Crop production and animal
                    rearing
                  </span>
                </div>

                <div className="skill-item">
                  <CheckCircle2 size={19} />
                  <span>
                    Manufacturing
                  </span>
                </div>

                <div className="skill-item">
                  <CheckCircle2 size={19} />
                  <span>
                    Photoshop designing
                  </span>
                </div>

                <div className="skill-item">
                  <CheckCircle2 size={19} />
                  <span>
                    Entrepreneurship, investment
                    and business management
                  </span>
                </div>

                <div className="skill-item">
                  <CheckCircle2 size={19} />
                  <span>
                    Monitoring & evaluation
                  </span>
                </div>

                <div className="skill-item">
                  <CheckCircle2 size={19} />
                  <span>
                    Nutrition
                  </span>
                </div>

              </div>

            </div>

          </Container>

        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section className="courses-cta">

          <Container>

            <div className="courses-cta-inner">

              <div>

                <span>
                  KNOWLEDGE WITH PURPOSE.
                </span>

                <h2>
                  Ready to Start Learning?
                </h2>

                <p>
                  Choose a subject, course or
                  practical skill and take the next
                  step toward your goals.
                </p>

              </div>

              <div className="cta-actions">

                <Link
                  to="/register"
                  className="cta-primary"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/contact"
                  className="cta-secondary"
                >
                  Contact Us
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

export default Courses;