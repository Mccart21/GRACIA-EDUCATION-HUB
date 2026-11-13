
import EducatorNavbar from "../../EducatorComponents/EducatorNavbar";
import EducatorFooter from "../../EducatorComponents/EducatorFooter";
import "./Contact.scss";

const EducatorContact = () => {
  return (
    <div className="contact-page">
      <EducatorNavbar />

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

      </main>

      <EducatorFooter />
    </div>
  );
};

export default EducatorContact;
