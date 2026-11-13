import { Link } from "react-router-dom";

import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import Container from "../common/Container";

import logo from "../../assets/icons/zep.jpg";

import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">

      <Container>

        <div className="footer-grid">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
            >

              <div className="footer-logo-icon">

                <img
                  src={logo}
                  alt="Gracia Education Hub"
                />

              </div>

              <div className="footer-logo-text">

                <strong>
                  GRACIA
                </strong>

                <span>
                  EDUCATION HUB
                </span>

              </div>

            </Link>

            <p>
              Affordable digital learning for
              students, professionals, and
              lifelong learners.
            </p>

            {/* =================================================
                SOCIAL MEDIA
            ================================================= */}

            <div className="social-links">

              <a
                href="#"
                aria-label="Facebook"
                className="social-icon"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="social-icon"
              >
                <FaTwitter size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="social-icon"
              >
                <FaInstagram size={18} />
              </a>

            </div>

          </div>

          {/* =================================================
              PLATFORM
          ================================================= */}

          <div className="footer-column">

            <h3>
              Platform
            </h3>

            <Link to="/courses">
              Courses
            </Link>

            <Link to="/subscriptions">
              Subscriptions
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </div>

          {/* =================================================
              LEARNING
          ================================================= */}

          <div className="footer-column">

            <h3>
              Learning
            </h3>

            <Link to="/courses?level=primary">
              Primary
            </Link>

            <Link to="/courses?level=secondary">
              Secondary
            </Link>

            <Link to="/courses?level=tertiary">
              Tertiary
            </Link>

            <Link to="/courses?category=skills">
              Practical Skills
            </Link>

          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div className="footer-column">

            <h3>
              Contact
            </h3>

            <div className="footer-contact">

              <MapPin size={17} />

              <span>
                Malawi
              </span>

            </div>

            <div className="footer-contact">

              <Phone size={17} />

              <span>
                +265 886 266 400
              </span>

            </div>

            <div className="footer-contact">

              <Mail size={17} />

              <span>
                info@graciaeducationhub.com
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()}{" "}
            Gracia Education Hub.
            All rights reserved.
          </p>

          <div>

            <Link to="/privacy">
              Privacy Policy
            </Link>

            <Link to="/terms">
              Terms & Conditions
            </Link>

          </div>

        </div>

      </Container>

    </footer>
  );
};

export default Footer;