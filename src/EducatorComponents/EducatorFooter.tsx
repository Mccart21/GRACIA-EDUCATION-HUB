
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  Video,
  Bell,
  UserRound,
  Info,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import logo from "../assets/icons/zep.jpg";
import "./EducatorFooter.scss";

const EducatorFooter = () => {
  return (
    <footer className="educator-footer">
      <div className="educator-footer__container">
        <div className="educator-footer__grid">
          {/* Educator brand */}
          <div className="educator-footer__brand">
            <Link
              to="/educator"
              className="educator-footer__logo"
              aria-label="Educator dashboard"
            >
              <div className="educator-footer__logo-image">
                <img
                  src={logo}
                  alt="Gracia Education Hub logo"
                />
              </div>

              <div className="educator-footer__logo-text">
                <strong>GRACIA</strong>
                <span>EDUCATION HUB</span>
              </div>
            </Link>

            <p className="educator-footer__description">
              Your educator workspace for teaching, learning
              materials, live classes, and learner support.
            </p>

            <div className="educator-footer__socials">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="educator-footer__social-link"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="educator-footer__social-link"
              >
                <FaInstagram />
              </a>

              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="educator-footer__social-link"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Educator workspace */}
          <div className="educator-footer__column">
            <h3>Educator Workspace</h3>

            <Link to="/educator" className="educator-footer__link">
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/educator/profile"
              className="educator-footer__link"
            >
              <UserRound size={16} />
              <span>My Profile</span>
            </Link>

            <Link
              to="/educator/notifications"
              className="educator-footer__link"
            >
              <Bell size={16} />
              <span>Notifications</span>
            </Link>

            <Link
              to="/educator/about"
              className="educator-footer__link"
            >
              <Info size={16} />
              <span>About Gracia</span>
            </Link>

            <Link
              to="/educator/contact"
              className="educator-footer__link"
            >
              <Mail size={16} />
              <span>Contact Support</span>
            </Link>
          </div>

          {/* Teaching tools */}
          <div className="educator-footer__column">
            <h3>Teaching Tools</h3>

            <Link
              to="/educator/my-teaching"
              className="educator-footer__link"
            >
              <GraduationCap size={16} />
              <span>My Teaching</span>
            </Link>

            <Link
              to="/educator/learning-materials"
              className="educator-footer__link"
            >
              <FolderOpen size={16} />
              <span>Learning Materials</span>
            </Link>

            <Link
              to="/educator/live-classes"
              className="educator-footer__link"
            >
              <Video size={16} />
              <span>Live Classes</span>
            </Link>
          </div>

          {/* Contact information */}
          <div className="educator-footer__column">
            <h3>Contact</h3>

            <div className="educator-footer__contact">
              <MapPin size={18} />
              <span>Malawi</span>
            </div>

            <a
              className="educator-footer__contact"
              href="tel:+265886266400"
            >
              <Phone size={18} />
              <span>+265 886 266 400</span>
            </a>

            <a
              className="educator-footer__contact"
              href="mailto:info@graciaeducationhub.com"
            >
              <Mail size={18} />
              <span>info@graciaeducationhub.com</span>
            </a>

            <p className="educator-footer__contact-note">
              For educator account access, teaching assignments,
              and platform support, contact the Gracia team.
            </p>

            <Link
              to="/educator/contact"
              className="educator-footer__support-link"
            >
              Visit Educator Support
            </Link>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="educator-footer__bottom">
          <p>
            © {new Date().getFullYear()} Gracia Education Hub.
            All rights reserved.
          </p>

          <Link to="/educator" className="educator-footer__home-link">
            Educator Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default EducatorFooter;
