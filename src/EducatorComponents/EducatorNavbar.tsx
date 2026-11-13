
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  Video,
  Bell,
  UserRound,
  Info,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import Container from "../components/common/Container";
import logo from "../assets/icons/zep.jpg";
import "./EducatorNavbar.scss";

function EducatorNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("gracia_current_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");

    closeMenu();
    navigate("/educator-login");
  };

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : "";

  return (
    <header className="educator-navbar">
      <Container>
        <div className="educator-navbar__inner">
          {/* Gracia brand */}
          <Link
            to="/educator"
            className="educator-navbar__brand"
            onClick={closeMenu}
            aria-label="Gracia Education Hub educator dashboard"
          >
            <div className="educator-navbar__logo-icon">
              <img src={logo} alt="Gracia Education Hub" />
            </div>

            <div className="educator-navbar__brand-text">
              <span>GRACIA</span>
              <small>EDUCATION HUB</small>
            </div>
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="educator-navbar__toggle"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Educator navigation */}
          <nav
            className={`educator-navbar__links ${
              menuOpen ? "is-open" : ""
            }`}
            aria-label="Educator navigation"
          >
            <NavLink
              to="/educator"
              end
              className={linkClassName}
              onClick={closeMenu}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/educator/my-teaching"
              className={linkClassName}
              onClick={closeMenu}
            >
              <GraduationCap size={18} />
              <span>My Teaching</span>
            </NavLink>

            <NavLink
              to="/educator/learning-materials"
              className={linkClassName}
              onClick={closeMenu}
            >
              <FolderOpen size={18} />
              <span>Learning Materials</span>
            </NavLink>

            <NavLink
              to="/educator/live-classes"
              className={linkClassName}
              onClick={closeMenu}
            >
              <Video size={18} />
              <span>Live Classes</span>
            </NavLink>

            <NavLink
              to="/educator/notifications"
              className={linkClassName}
              onClick={closeMenu}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </NavLink>

            <NavLink
              to="/educator/profile"
              className={linkClassName}
              onClick={closeMenu}
            >
              <UserRound size={18} />
              <span>My Profile</span>
            </NavLink>

            <NavLink
              to="/educator/about"
              className={linkClassName}
              onClick={closeMenu}
            >
              <Info size={18} />
              <span>About Us</span>
            </NavLink>

            <NavLink
              to="/educator/contact"
              className={linkClassName}
              onClick={closeMenu}
            >
              <Mail size={18} />
              <span>Contact</span>
            </NavLink>
          </nav>

          {/* Logout only: no name, role, or account avatar */}
          <div className="educator-navbar__account">
            <button
              type="button"
              className="educator-navbar__logout"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={19} />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default EducatorNavbar;
