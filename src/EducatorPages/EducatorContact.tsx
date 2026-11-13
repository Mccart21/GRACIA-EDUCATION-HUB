import EducatorNavbar from "../EducatorComponents/EducatorNavbar";
import EducatorFooter from "../EducatorComponents/EducatorFooter";
import "./EducatorContact.scss";

const EducatorContact = () => {
  return (
    <div className="contact-page">
      <EducatorNavbar />

      <main className="contact-content">
        <section className="contact-intro">
          <h4>CONTACT US</h4>
          <h1>We're here to help you.</h1>

          <p>
            Have a question about our training programs or services?
            Get in touch with Gracia Education Hub and we'll be happy
            to assist you.
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
          <h2>Need assistance?</h2>
          <p>Return to your educator dashboard.</p>

          <div className="contact-buttons">
            <a
              href="/educator"
              className="contact-button educator-button"
            >
              Return to Educator Dashboard
            </a>
          </div>
        </section>
      </main>

      <EducatorFooter />
    </div>
  );
};

export default EducatorContact;