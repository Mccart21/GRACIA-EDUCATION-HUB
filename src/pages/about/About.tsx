import {
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Users,
  Lightbulb,
  Award,
  Monitor,
  BarChart3,
  Briefcase,
  Sprout,
  Factory,
  Palette,
  TrendingUp,
  ClipboardCheck,
  Apple,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Container from "../../components/common/Container";



import "./About.scss";

const About = () => {
  return (
    <div className="about-page">

      <Navbar />

      <main>

        {/* =====================================================
            ABOUT HERO
        ===================================================== */}

        <section className="about-hero">

          <div className="about-hero-background">
            <div className="about-glow about-glow-one"></div>
            <div className="about-glow about-glow-two"></div>

            <div className="about-grid-pattern"></div>

            <div className="about-circle about-circle-one"></div>
            <div className="about-circle about-circle-two"></div>
          </div>

          <Container>

            <div className="about-hero-content">

              <div className="about-hero-text">

                <div className="about-logo-wrapper">

                  <div className="about-logo">
                    
                    
                  </div>

                  <div className="about-logo-name">
                    

                    
                  </div>

                </div>

                <span className="about-badge">
                  WHO WE ARE
                </span>

                <h1>
                  Knowledge with Purpose.
                  <span>
                    Impact with Action.
                  </span>
                </h1>

                <p>
                  Gracia Education Hub is committed to providing
                  affordable, quality and all-rounded education
                  and training to students and professionals.
                </p>

                <div className="about-hero-actions">

                  <a
                    href="#mission"
                    className="about-primary-button"
                  >
                    Discover Our Mission
                    <ArrowRight size={18} />
                  </a>

                  <a
                    href="#services"
                    className="about-secondary-button"
                  >
                    What We Offer
                  </a>

                </div>

              </div>

              <div className="about-hero-visual">

                <div className="about-visual-glow"></div>

                <div className="about-intro-card">

                  <div className="about-card-top">

                    <div className="about-card-logo">
                      
                    </div>

                    <span>
                      OUR PURPOSE
                    </span>

                  </div>

                  <div className="about-card-icon">
                    <Target size={34} />
                  </div>

                  <span className="about-card-label">
                    EDUCATION • TRAINING • IMPACT
                  </span>

                  <h2>
                    Empowering Learners for a Better Future
                  </h2>

                  <p>
                    We equip students and professionals with
                    knowledge, practical skills, strong values,
                    and the confidence to create meaningful
                    impact locally and globally.
                  </p>

                  <div className="about-card-footer">

                    <span>
                      All-rounded learning
                    </span>

                    <CheckCircle2 size={18} />

                  </div>

                </div>

              </div>

            </div>

          </Container>

        </section>


        {/* =====================================================
            VISION + MISSION
        ===================================================== */}

        <section
          className="about-purpose-section"
          id="mission"
        >

          <Container>

            <div className="about-section-heading">

              <span>
                OUR PURPOSE
              </span>

              <h2>
                Education Beyond the Classroom
              </h2>

              <p>
                Our approach combines academic knowledge,
                character, values and practical skills to
                prepare people for meaningful contribution
                in society.
              </p>

            </div>

            <div className="purpose-grid">

              {/* VISION */}

              <div className="purpose-card">

                <div className="purpose-icon">
                  <Eye size={28} />
                </div>

                <span className="purpose-label">
                  OUR VISION
                </span>

                <h3>
                  Offering Services at All Levels
                </h3>

                <p>
                  We envision an education hub that provides
                  accessible learning and training opportunities
                  across different levels, helping learners
                  continuously develop their knowledge and
                  abilities.
                </p>

              </div>


              {/* MISSION */}

              <div className="purpose-card purpose-card-featured">

                <div className="purpose-icon">
                  <Target size={28} />
                </div>

                <span className="purpose-label">
                  OUR MISSION
                </span>

                <h3>
                  Affordable Quality Education
                </h3>

                <p>
                  To provide affordable, quality all-rounded
                  education and training to students and
                  professionals, equipping them with skills
                  and values for national and global impact.
                </p>

              </div>


              {/* APPROACH */}

              <div className="purpose-card">

                <div className="purpose-icon">
                  <Heart size={28} />
                </div>

                <span className="purpose-label">
                  OUR APPROACH
                </span>

                <h3>
                  All-Rounded Education
                </h3>

                <p>
                  We seek to incorporate character, values and
                  practical skills into learning so that
                  education can translate into positive action
                  and real-world impact.
                </p>

              </div>

            </div>

          </Container>

        </section>


        {/* =====================================================
            MOTTO
        ===================================================== */}

        <section className="motto-section">

          <Container>

            <div className="motto-card">

              <div className="motto-logo">
               
              </div>

              <div className="motto-content">

                <span>
                  OUR MOTTO
                </span>

                <h2>
                  "Knowledge with purpose.
                  <strong>
                    Impact with action.
                  </strong>"
                </h2>

              </div>

            </div>

          </Container>

        </section>


        {/* =====================================================
            VALUES
        ===================================================== */}

        <section className="values-section">

          <Container>

            <div className="about-section-heading">

              <span>
                OUR VALUES
              </span>

              <h2>
                What Guides Us
              </h2>

              <p>
                Our values shape how we teach, serve,
                collaborate and create impact.
              </p>

            </div>

            <div className="values-grid">

              <div className="value-card">
                <div className="value-icon">
                  <ShieldCheck />
                </div>

                <h3>
                  Integrity
                </h3>

                <p>
                  We uphold honesty, accountability and
                  responsible conduct.
                </p>
              </div>


              <div className="value-card">
                <div className="value-icon">
                  <Users />
                </div>

                <h3>
                  Inclusion
                </h3>

                <p>
                  We value diverse people, perspectives
                  and learning needs.
                </p>
              </div>


              <div className="value-card">
                <div className="value-icon">
                  <Award />
                </div>

                <h3>
                  Hard Work
                </h3>

                <p>
                  We believe consistent effort is essential
                  for meaningful growth.
                </p>
              </div>


              <div className="value-card">
                <div className="value-icon">
                  <Award />
                </div>

                <h3>
                  Excellence
                </h3>

                <p>
                  We continuously strive for high-quality
                  learning and service delivery.
                </p>
              </div>


              <div className="value-card">
                <div className="value-icon">
                  <Lightbulb />
                </div>

                <h3>
                  Innovation
                </h3>

                <p>
                  We embrace creative approaches and
                  technology to improve learning.
                </p>
              </div>

            </div>

          </Container>

        </section>


        {/* =====================================================
            SERVICES
        ===================================================== */}

        <section
          className="services-section"
          id="services"
        >

          <Container>

            <div className="about-section-heading services-heading">

              <span>
                WHAT WE OFFER
              </span>

              <h2>
                Practical Knowledge for the Real World
              </h2>

              <p>
                Our services cover digital skills, professional
                development, business, agriculture, education
                and practical community needs.
              </p>

            </div>

            <div className="services-grid">

              <div className="service-card">
                <div className="service-icon">
                  <BarChart3 />
                </div>

                <div>
                  <h3>
                    Data Analysis
                  </h3>

                  <p>
                    Develop practical skills for working with
                    data and producing meaningful insights.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <Monitor />
                </div>

                <div>
                  <h3>
                    Computer Basics
                  </h3>

                  <p>
                    Build essential computer literacy and
                    digital skills.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <BookOpen />
                </div>

                <div>
                  <h3>
                    Software Packages
                  </h3>

                  <p>
                    Learn how to effectively use different
                    software packages.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <Briefcase />
                </div>

                <div>
                  <h3>
                    Job Applications
                  </h3>

                  <p>
                    Support with job applications and
                    professional preparation.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <Sprout />
                </div>

                <div>
                  <h3>
                    Agriculture
                  </h3>

                  <p>
                    Practical guidance on crop growing and
                    animal rearing.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <Factory />
                </div>

                <div>
                  <h3>
                    Manufacturing
                  </h3>

                  <p>
                    Explore practical manufacturing skills
                    and opportunities.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <Palette />
                </div>

                <div>
                  <h3>
                    Photoshop Designing
                  </h3>

                  <p>
                    Develop creative digital design and
                    image editing skills.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <TrendingUp />
                </div>

                <div>
                  <h3>
                    Entrepreneurship & Investment
                  </h3>

                  <p>
                    Learn about entrepreneurship, investment
                    and business management.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <ClipboardCheck />
                </div>

                <div>
                  <h3>
                    Monitoring & Evaluation
                  </h3>

                  <p>
                    Develop skills in monitoring, evaluation
                    and program performance.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <Apple />
                </div>

                <div>
                  <h3>
                    Nutrition
                  </h3>

                  <p>
                    Promote practical knowledge and awareness
                    around nutrition.
                  </p>
                </div>
              </div>


              <div className="service-card">
                <div className="service-icon">
                  <BookOpen />
                </div>

                <div>
                  <h3>
                    Courses & Training
                  </h3>

                  <p>
                    Access selected courses and training
                    opportunities for different learners.
                  </p>
                </div>
              </div>

            </div>

          </Container>

        </section>


        {/* =====================================================
            LEADERSHIP
        ===================================================== */}

        <section className="leadership-section">

          <Container>

            <div className="about-section-heading">

              <span>
                OUR TEAM
              </span>

              <h2>
                Leadership & Management
              </h2>

              <p>
                Our team provides direction, coordination and
                expertise to support the mission of Gracia
                Education Hub.
              </p>

            </div>

            <div className="leadership-grid">

              <div className="leader-card leader-card-featured">

                <div className="leader-number">
                  01
                </div>

                <div className="leader-icon">
                  <Users />
                </div>

                <span>
                  CHIEF EXECUTIVE OFFICER
                </span>

                <h3>
                  Hastings Bwanali Taombe
                </h3>

              </div>


              <div className="leader-card">

                <div className="leader-number">
                  02
                </div>

                <div className="leader-icon">
                  <Users />
                </div>

                <span>
                  MANAGEMENT
                </span>

                <h3>
                  Bright Chifwenthe
                </h3>

              </div>


              <div className="leader-card">

                <div className="leader-number">
                  03
                </div>

                <div className="leader-icon">
                  <Briefcase />
                </div>

                <span>
                  MARKETING & COMMUNICATION
                </span>

                <h3>
                  Marketing & Communication Officer
                </h3>

              </div>


              <div className="leader-card">

                <div className="leader-number">
                  04
                </div>

                <div className="leader-icon">
                  <Target />
                </div>

                <span>
                  PROGRAMS & OPERATIONS
                </span>

                <h3>
                  Program / Operations Manager
                </h3>

              </div>


              <div className="leader-card">

                <div className="leader-number">
                  05
                </div>

                <div className="leader-icon">
                  <TrendingUp />
                </div>

                <span>
                  FINANCE & INVESTMENTS
                </span>

                <h3>
                  Finance & Investments Officer
                </h3>

              </div>


              <div className="leader-card">

                <div className="leader-number">
                  06
                </div>

                <div className="leader-icon">
                  <Monitor />
                </div>

                <span>
                  ICT & DIGITAL SKILLS
                </span>

                <h3>
                  ICT & Digital Skills
                </h3>

              </div>

            </div>

          </Container>

        </section>


        {/* =====================================================
            CALL TO ACTION
        ===================================================== */}

        <section className="about-cta">

          <Container>

            <div className="about-cta-card">

              <div className="about-cta-logo">

               

              </div>

              <div className="about-cta-content">

                <span>
                  START YOUR JOURNEY
                </span>

                <h2>
                  Learn Today. Create Impact Tomorrow.
                </h2>

                <p>
                  Join Gracia Education Hub and take the
                  next step toward knowledge, skills and
                  meaningful impact.
                </p>

              </div>

              <a
                href="/courses"
                className="about-cta-button"
              >
                Explore Courses
                <ArrowRight size={18} />
              </a>

            </div>

          </Container>

        </section>

      </main>

      <Footer />

    </div>
  );
};

export default About;