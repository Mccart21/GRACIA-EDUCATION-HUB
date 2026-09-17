import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Laptop,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";


import "./Home.scss";

const Home = () => {
  return (
    <div className="home-page">

      <Navbar />

      <main>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="hero">

          {/* Background decorations */}

          <div className="hero-background">

            <div className="hero-glow hero-glow-one" />
            <div className="hero-glow hero-glow-two" />

            <div className="hero-grid-pattern" />

            <div className="hero-circle hero-circle-one" />
            <div className="hero-circle hero-circle-two" />

          </div>

          <Container>

            <div className="hero-content">

              {/* =================================================
                  HERO TEXT
              ================================================= */}

              <div className="hero-text">

                {/* LOGO */}

                <div className="hero-logo-wrapper">

                  <div className="hero-logo">

                    

                  </div>

                  <div className="hero-logo-name">

                    

                  </div>

                </div>

                {/* BADGE */}

                <span className="hero-badge">


                  Knowledge with purpose.
                  Impact with action.

                </span>

                {/* HEADING */}

                <h1>

                  Education That

                  <span>
                    Moves You Forward.
                  </span>

                </h1>

                {/* DESCRIPTION */}

                <p>

                  Gracia Education Hub provides
                  <strong>
                    affordable digital learning
                  </strong>{" "}
                  for primary, secondary,
                  tertiary, and practical skills
                  learners.

                </p>

                {/* ACTIONS */}

                <div className="hero-actions">

                  <Link
                    to="/courses"
                    className="primary-button"
                  >

                    Explore Courses

                    <ArrowRight size={18} />

                  </Link>

                  <Link
                    to="/subscriptions"
                    className="secondary-button"
                  >
                    View Subscriptions
                  </Link>

                </div>

                {/* TRUST */}

                <div className="hero-trust">

                  <div>

                    <BookOpen size={18} />

                    <span>
                      Quality Courses
                    </span>

                  </div>

                  <div>

                    <Laptop size={18} />

                    <span>
                      Learn Anywhere
                    </span>

                  </div>

                  <div>

                    <GraduationCap size={18} />

                    <span>
                      Learn Your Level
                    </span>

                  </div>

                </div>

              </div>

              {/* =================================================
                  HERO VISUAL
              ================================================= */}

              <div className="hero-visual">

                <div className="hero-visual-glow" />

                <div className="hero-card">

                  {/* CARD LOGO */}

                  <div className="hero-card-top">

                    <div className="hero-card-logo">


                    </div>

                    <span>
                      LEARNING HUB
                    </span>

                  </div>

                  {/* ICON */}

                  <div className="hero-card-icon">

                    <GraduationCap size={40} />

                  </div>

                  <span className="hero-card-label">
                    YOUR FUTURE STARTS HERE
                  </span>

                  <h3>
                    Start Learning Today
                  </h3>

                  <p>
                    Access affordable courses
                    designed around your learning
                    level, goals and future.
                  </p>

                  {/* STATS */}

                  <div className="hero-mini-stats">

                    <div>

                      <strong>
                        100+
                      </strong>

                      <span>
                        Courses
                      </span>

                    </div>

                    <div>

                      <strong>
                        4
                      </strong>

                      <span>
                        Learning Levels
                      </span>

                    </div>

                    <div>

                      <strong>
                        24/7
                      </strong>

                      <span>
                        Access
                      </span>

                    </div>

                  </div>

                  {/* CARD FOOTER */}

                  <div className="hero-card-footer">

                    <span>
                      Learn at your own pace
                    </span>

                    <ArrowRight size={16} />

                  </div>

                </div>

              </div>

            </div>

          </Container>

        </section>

        {/* =====================================================
            LEARNING LEVELS
        ===================================================== */}

        <section className="levels-section">

          <Container>

            <div className="section-heading">

              <span>
                LEARNING LEVELS
              </span>

              <h2>
                Something for Every Learner
              </h2>

              <p>
                Choose a learning path that matches
                where you are and where you want to go.
              </p>

            </div>

            <div className="levels-grid">

              {/* PRIMARY */}

              <Link
                to="/courses?level=primary"
                className="level-card"
              >

                <div className="level-icon">
                  <BookOpen />
                </div>

                <h3>
                  Primary
                </h3>

                <p>
                  Build strong foundations in
                  essential subjects.
                </p>

                <span>

                  Explore Primary

                  <ArrowRight size={16} />

                </span>

              </Link>

              {/* SECONDARY */}

              <Link
                to="/courses?level=secondary"
                className="level-card"
              >

                <div className="level-icon">
                  <GraduationCap />
                </div>

                <h3>
                  Secondary
                </h3>

                <p>
                  Strengthen your knowledge and
                  prepare for academic success.
                </p>

                <span>

                  Explore Secondary

                  <ArrowRight size={16} />

                </span>

              </Link>

              {/* TERTIARY */}

              <Link
                to="/courses?level=tertiary"
                className="level-card"
              >

                <div className="level-icon">
                  <Laptop />
                </div>

                <h3>
                  Tertiary
                </h3>

                <p>
                  Develop advanced academic and
                  professional knowledge.
                </p>

                <span>

                  Explore Tertiary

                  <ArrowRight size={16} />

                </span>

              </Link>

              {/* PRACTICAL SKILLS */}

              <Link
                to="/courses?category=skills"
                className="level-card"
              >

                <div className="level-icon">
                  <PlayCircle />
                </div>

                <h3>
                  Practical Skills
                </h3>

                <p>
                  Learn useful skills for work,
                  business, and personal growth.
                </p>

                <span>

                  Explore Skills

                  <ArrowRight size={16} />

                </span>

              </Link>

            </div>

          </Container>

        </section>

      </main>

      <Footer />

    </div>
  );
};

export default Home;