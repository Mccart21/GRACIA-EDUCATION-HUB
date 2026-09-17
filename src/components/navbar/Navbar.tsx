import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useState } from "react";

import Container from "../common/Container";

import logo from "../../assets/icons/zep.jpeg";

import "./Navbar.scss";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">

      <Container>

        <div className="navbar-content">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="navbar-logo"
            onClick={closeMenu}
          >

            <div className="logo-icon">

              <img
                src={logo}
                alt="Gracia Education Hub"
              />

            </div>

            <div className="logo-text">

              <span>
                GRACIA
              </span>

              <small>
                EDUCATION HUB
              </small>

            </div>

          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="desktop-nav">

            <Link to="/">
              Home
            </Link>

            <Link to="/courses">
              Courses
            </Link>

            <Link to="/subscriptions">
              Subscriptions
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </nav>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="navbar-actions">

            {/* STUDENT DASHBOARD */}

            <Link
              to="/student"
              className="dashboard-button"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            {/* LOGIN */}

            <Link
              to="/login"
              className="login-button"
            >
              Login
            </Link>

            {/* REGISTER */}

            <Link
              to="/register"
              className="register-button"
            >
              Get Started
            </Link>

          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >

            {mobileMenuOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}

          </button>

        </div>

        {/* =================================================
            MOBILE NAVIGATION
        ================================================= */}

        {mobileMenuOpen && (

          <div className="mobile-nav">

            <Link
              to="/"
              onClick={closeMenu}
            >
              Home
            </Link>

            <Link
              to="/courses"
              onClick={closeMenu}
            >
              Courses
            </Link>

            <Link
              to="/subscriptions"
              onClick={closeMenu}
            >
              Subscriptions
            </Link>

            <Link
              to="/about"
              onClick={closeMenu}
            >
              About
            </Link>

            <Link
              to="/contact"
              onClick={closeMenu}
            >
              Contact
            </Link>

            <Link
              to="/student"
              onClick={closeMenu}
              className="dashboard-button"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </Link>

            <div className="mobile-actions">

              <Link
                to="/login"
                onClick={closeMenu}
                className="login-button"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="register-button"
              >
                Get Started
              </Link>

            </div>

          </div>

        )}

      </Container>

    </header>
  );
};

export default Navbar;