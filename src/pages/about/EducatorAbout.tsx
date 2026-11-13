
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
  type LucideIcon,
} from "lucide-react";

import EducatorNavbar from "../../EducatorComponents/EducatorNavbar";
import EducatorFooter from "../../EducatorComponents/EducatorFooter";
import Container from "../../components/common/Container";

import "./About.scss";

interface TeamMember {
  id: number;
  role: string;
  name: string;
  icon: LucideIcon;
}

const values = [
  {
    title: "Integrity",
    description: "We uphold honesty, accountability and responsible conduct.",
    icon: ShieldCheck,
  },
  {
    title: "Inclusion",
    description: "We value diverse people, perspectives and learning needs.",
    icon: Users,
  },
  {
    title: "Hard Work",
    description: "We believe consistent effort is essential for meaningful growth.",
    icon: Award,
  },
  {
    title: "Excellence",
    description: "We continuously strive for high-quality learning and service delivery.",
    icon: Award,
  },
  {
    title: "Innovation",
    description: "We embrace creative approaches and technology to improve learning.",
    icon: Lightbulb,
  },
];

const services = [
  {
    title: "Data Analysis",
    description: "Develop practical skills for working with data and producing meaningful insights.",
    icon: BarChart3,
  },
  {
    title: "Computer Basics",
    description: "Build essential computer literacy and digital skills.",
    icon: Monitor,
  },
  {
    title: "Software Packages",
    description: "Learn how to effectively use different software packages.",
    icon: BookOpen,
  },
  {
    title: "Job Applications",
    description: "Support with job applications and professional preparation.",
    icon: Briefcase,
  },
  {
    title: "Agriculture",
    description: "Practical guidance on crop growing and animal rearing.",
    icon: Sprout,
  },
  {
    title: "Manufacturing",
    description: "Explore practical manufacturing skills and opportunities.",
    icon: Factory,
  },
  {
    title: "Photoshop Designing",
    description: "Develop creative digital design and image editing skills.",
    icon: Palette,
  },
  {
    title: "Entrepreneurship & Investment",
    description: "Learn about entrepreneurship, investment and business management.",
    icon: TrendingUp,
  },
  {
    title: "Monitoring & Evaluation",
    description: "Develop skills in monitoring, evaluation and program performance.",
    icon: ClipboardCheck,
  },
  {
    title: "Nutrition",
    description: "Promote practical knowledge and awareness around nutrition.",
    icon: Apple,
  },
  {
    title: "Courses & Training",
    description: "Access selected courses and training opportunities for different learners.",
    icon: BookOpen,
  },
];

const teamMembers: TeamMember[] = [
  {
    id: 1,
    role: "Chief Executive Officer",
    name: "Hastings Bwanali Taombe",
    icon: Users,
  },
  {
    id: 2,
    role: "Management",
    name: "Bright Chifwenthe",
    icon: Users,
  },
  {
    id: 3,
    role: "Marketing & Communication",
    name: "Marketing & Communication Officer",
    icon: Briefcase,
  },
  {
    id: 4,
    role: "Programs & Operations",
    name: "Program / Operations Manager",
    icon: Target,
  },
  {
    id: 5,
    role: "Finance & Investments",
    name: "Finance & Investments Officer",
    icon: TrendingUp,
  },
  {
    id: 6,
    role: "ICT & Digital Skills",
    name: "ICT & Digital Skills",
    icon: Monitor,
  },
];

const EducatorAbout = () => {
  return (
    <div className="about-page">
      <EducatorNavbar />

      <main>
        {/* ABOUT INTRODUCTION */}
        <section className="about-hero">
          <Container>
            <div className="about-hero-content">
              <div className="about-hero-text">
                <span className="about-eyebrow">WHO WE ARE</span>

                <h1>
                  Knowledge with Purpose.
                  <span>Impact with Action.</span>
                </h1>

                <p>
                  Gracia Education Hub is committed to providing
                  affordable, quality and all-rounded education
                  and training to students and professionals.
                </p>

                <div className="about-hero-actions">
                  <a href="#mission" className="about-button">
                    Discover Our Mission
                    <ArrowRight size={17} />
                  </a>

                  <a href="#services" className="about-text-link">
                    What We Offer
                  </a>
                </div>
              </div>

              <div className="about-hero-purpose">
                <span className="about-eyebrow">OUR PURPOSE</span>
                <Target size={30} className="about-purpose-symbol" />

                <h2>Empowering Learners for a Better Future</h2>

                <p>
                  We equip students and professionals with knowledge,
                  practical skills, strong values, and the confidence
                  to create meaningful impact locally and globally.
                </p>

                <div className="about-purpose-footer">
                  <CheckCircle2 size={17} />
                  <span>All-rounded learning</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* VISION AND MISSION */}
        <section className="about-section about-purpose-section" id="mission">
          <Container>
            <div className="about-section-heading">
              <span className="about-eyebrow">OUR PURPOSE</span>
              <h2>Education Beyond the Classroom</h2>
              <p>
                Our approach combines academic knowledge, character,
                values and practical skills to prepare people for
                meaningful contribution in society.
              </p>
            </div>

            <div className="purpose-list">
              <article className="purpose-row">
                <div className="purpose-row-icon">
                  <Eye size={23} />
                </div>
                <div className="purpose-row-content">
                  <span className="about-eyebrow">OUR VISION</span>
                  <h3>Offering Services at All Levels</h3>
                  <p>
                    We envision an education hub that provides accessible
                    learning and training opportunities across different
                    levels, helping learners continuously develop their
                    knowledge and abilities.
                  </p>
                </div>
              </article>

              <article className="purpose-row">
                <div className="purpose-row-icon">
                  <Target size={23} />
                </div>
                <div className="purpose-row-content">
                  <span className="about-eyebrow">OUR MISSION</span>
                  <h3>Affordable Quality Education</h3>
                  <p>
                    To provide affordable, quality all-rounded education
                    and training to students and professionals, equipping
                    them with skills and values for national and global impact.
                  </p>
                </div>
              </article>

              <article className="purpose-row">
                <div className="purpose-row-icon">
                  <Heart size={23} />
                </div>
                <div className="purpose-row-content">
                  <span className="about-eyebrow">OUR APPROACH</span>
                  <h3>All-Rounded Education</h3>
                  <p>
                    We seek to incorporate character, values and practical
                    skills into learning so that education can translate
                    into positive action and real-world impact.
                  </p>
                </div>
              </article>
            </div>
          </Container>
        </section>

        {/* MOTTO */}
        <section className="motto-section">
          <Container>
            <div className="motto-content">
              <span className="about-eyebrow">OUR MOTTO</span>
              <h2>
                Knowledge with purpose.
                <strong>Impact with action.</strong>
              </h2>
            </div>
          </Container>
        </section>

        {/* VALUES */}
        <section className="about-section values-section">
          <Container>
            <div className="about-section-heading">
              <span className="about-eyebrow">OUR VALUES</span>
              <h2>What Guides Us</h2>
              <p>
                Our values shape how we teach, serve, collaborate
                and create impact.
              </p>
            </div>

            <div className="values-list">
              {values.map((value, index) => {
                const Icon = value.icon;

                return (
                  <article className="value-row" key={value.title}>
                    <span className="about-item-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon size={22} className="about-item-icon" />
                    <div>
                      <h3>{value.title}</h3>
                      <p>{value.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        {/* SERVICES */}
        <section className="about-section services-section" id="services">
          <Container>
            <div className="about-section-heading">
              <span className="about-eyebrow">WHAT WE OFFER</span>
              <h2>Practical Knowledge for the Real World</h2>
              <p>
                Our services cover digital skills, professional
                development, business, agriculture, education
                and practical community needs.
              </p>
            </div>

            <div className="services-list">
              {services.map((service, index) => {
                const Icon = service.icon;

                return (
                  <article className="service-row" key={service.title}>
                    <span className="about-item-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon size={22} className="about-item-icon" />
                    <div>
                      <h3>{service.title}</h3>
                      <p>{service.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        {/* LEADERSHIP */}
        <section className="about-section leadership-section" id="team">
          <Container>
            <div className="about-section-heading">
              <span className="about-eyebrow">OUR TEAM</span>
              <h2>Leadership & Management</h2>
              <p>
                Our team provides direction, coordination and expertise
                to support the mission of Gracia Education Hub.
              </p>
            </div>

            <div className="leadership-list">
              {teamMembers.map((member) => {
                const Icon = member.icon;

                return (
                  <article className="leader-row" key={member.id}>
                    <div className="leader-photo" aria-hidden="true" />

                    <div className="leader-details">
                      <span className="about-eyebrow">{member.role}</span>
                      <h3>{member.name}</h3>
                    </div>

                    <span className="leader-role-icon" aria-hidden="true">
                      <Icon size={19} />
                    </span>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        {/* CALL TO ACTION */}
        <section className="about-cta">
          <Container>
            <div className="about-cta-content">
              <div>
                <span className="about-eyebrow">START YOUR JOURNEY</span>
                <h2>Learn Today. Create Impact Tomorrow.</h2>
                <p>
                  Join Gracia Education Hub and take the next step
                  toward knowledge, skills and meaningful impact.
                </p>
              </div>

              <a href="/courses" className="about-button">
                Explore Courses
                <ArrowRight size={17} />
              </a>
            </div>
          </Container>
        </section>
      </main>

      <EducatorFooter />
    </div>
  );
};

export default EducatorAbout;