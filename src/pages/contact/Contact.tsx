import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

import "./Contact.scss";

const Contact = () => {
  return (
    <div className="gracia-contact">
      <Navbar />

      <main className="contact-main">
        {/* Hero / Intro */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <div className="contact-badge">
              <MessageCircle size={17} />
              <span>We'd love to hear from you</span>
            </div>

            <h1>
              We're here to <span>help you.</span>
            </h1>

            <p>
              Have a question about our courses, subscriptions, training
              programs, or services? Get in touch with the Gracia Education Hub
              team and we'll be happy to assist you.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="contact-information">
          <div className="contact-section-heading">
            <span>GET IN TOUCH</span>
            <h2>Let's start a conversation</h2>
            <p>
              Whether you are a student, professional, parent, or organisation,
              we're ready to help you find the right learning opportunity.
            </p>
          </div>

          <div className="contact-cards">
            {/* Phone */}
            <div className="contact-card">
              <div className="contact-card-icon">
                <Phone size={23} />
              </div>

              <div className="contact-card-content">
                <span className="contact-card-label">Phone</span>
                <h3>Call us</h3>

                <a href="tel:+265999999999">
                  +265 999 999 999
                </a>

                <div className="contact-card-note">
                  <Clock size={15} />
                  <span>Monday – Friday, 8:00 AM – 5:00 PM</span>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="contact-card">
              <div className="contact-card-icon">
                <Mail size={23} />
              </div>

              <div className="contact-card-content">
                <span className="contact-card-label">Email</span>
                <h3>Send us an email</h3>

                <a href="mailto:info@graciaeducationhub.com">
                  info@graciaeducationhub.com
                </a>

                <div className="contact-card-note">
                  <ShieldCheck size={15} />
                  <span>We aim to respond as soon as possible.</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="contact-card">
              <div className="contact-card-icon">
                <MapPin size={23} />
              </div>

              <div className="contact-card-content">
                <span className="contact-card-label">Location</span>
                <h3>Visit us</h3>

                <p>
                  Malawi
                </p>

                <div className="contact-card-note">
                  <MapPin size={15} />
                  <span>Serving learners at all levels</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Help CTA */}
        <section className="contact-help">
          <div className="contact-help-content">
            <div className="contact-help-icon">
              <MessageCircle size={25} />
            </div>

            <div>
              <span className="contact-help-label">NEED MORE HELP?</span>

              <h2>
                Let's find the right learning path for you.
              </h2>

              <p>
                Explore our courses and practical skills programs designed to
                help students and professionals grow with knowledge, skills,
                and values.
              </p>
            </div>
          </div>

          <Link to="/courses" className="contact-help-button">
            Explore Courses
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;