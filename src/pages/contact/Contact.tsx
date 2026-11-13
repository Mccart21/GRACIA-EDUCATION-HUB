
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./Contact.scss";

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />

      <main className="contact-content">
        <section className="contact-intro">
          <h4>CONTACT US</h4>
          <h1>We're here to help you.</h1>

          <p>
            Have a question about our courses, subjects, subscriptions,
            training programs, or services? Get in touch with Gracia
            Education Hub and we'll be happy to assist you.
          </p>
        </section>

        <hr className="contact-divider" />

        <section className="contact-details">
          <h2>Get in Touch</h2>

          <div className="contact-details-grid">
            <div className="contact-item">
              <strong>Phones</strong>
              <p>0882266911</p>
              <p>0886266400</p>
              <p>0984778429</p>
            </div>

            <div className="contact-item">
              <strong>Email</strong>
              <p>
                <a href="mailto:info@graciaeducationhub.com">
                  info@graciaeducationhub.com
                </a>
              </p>
            </div>

            <div className="contact-item contact-location">
              <strong>Location</strong>
              <p>Malawi</p>
            </div>
          </div>
        </section>

        <hr className="contact-divider" />

        <section className="contact-explore">
          <h2>Need academic help?</h2>
          <p>Explore our available courses and subjects.</p>

          <div className="contact-buttons">
            <Link to="/courses" className="contact-button courses-button">
              Explore Courses
            </Link>

            <Link to="/subjects" className="contact-button subjects-button">
              Explore Subjects
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
