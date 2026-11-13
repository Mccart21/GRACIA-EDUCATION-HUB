import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, UserRound, LogOut } from "lucide-react";

import Container from "../common/Container";
import logo from "../../assets/icons/zep.jpg";
import "./Navbar.scss";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

type LearningLevel = "primary" | "secondary" | "tertiary" | "skills" | "";

interface StoredUser {
  level?: string;
}

const normalizeLevel = (level?: string): LearningLevel => {
  const value = String(level || "").toLowerCase().trim();

  if (value === "primary") return "primary";
  if (value === "secondary") return "secondary";
  if (value === "tertiary") return "tertiary";
  if (value === "skills" || value === "practical skills") return "skills";

  return "";
};

const readStoredUser = (): StoredUser | null => {
  try {
    const value = localStorage.getItem("gracia_current_user");
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [level, setLevel] = useState<LearningLevel>(
    normalizeLevel(readStoredUser()?.level)
  );

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const syncUser = () => {
      const token = localStorage.getItem("token");
      setAuthenticated(Boolean(token));
      setLevel(normalizeLevel(readStoredUser()?.level));
    };

    const loadUser = async () => {
      syncUser();

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const data = await response.json();
        const user = data.user ?? data.data?.user ?? data.data ?? data;

        if (user && typeof user === "object") {
          localStorage.setItem("gracia_current_user", JSON.stringify(user));
          setLevel(normalizeLevel(user.level));
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Unable to load navigation profile:", error);
      }
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("gracia:user-updated", syncUser);
    window.addEventListener("gracia:auth-changed", syncUser);

    void loadUser();

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("gracia:user-updated", syncUser);
      window.removeEventListener("gracia:auth-changed", syncUser);
    };
  }, []);

  const catalogueLinks = !authenticated
    ? [
        { to: "/courses", label: "Courses" },
        { to: "/subjects", label: "Subjects" },
      ]
    : level === "primary" || level === "secondary"
      ? [{ to: "/subjects", label: "Subjects" }]
      : level === "tertiary" || level === "skills"
        ? [{ to: "/courses", label: "Courses" }]
        : [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("gracia_current_user");
    localStorage.removeItem("gracia_remember_me");
    localStorage.removeItem("gracia_login_email");
    localStorage.removeItem("gracia_student");
    localStorage.removeItem("gracia_registered_email");

    setAuthenticated(false);
    setLevel("");
    closeMenu();
    window.dispatchEvent(new Event("gracia:auth-changed"));
    navigate("/login");
  };

  const renderCatalogueLinks = () =>
    catalogueLinks.map((item) => (
      <Link key={item.to} to={item.to} onClick={closeMenu}>
        {item.label}
      </Link>
    ));

  return (
    <header className="navbar">
      <Container>
        <div className="navbar-content">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <div className="logo-icon">
              <img src={logo} alt="Gracia Education Hub" />
            </div>
            <div className="logo-text">
              <span>GRACIA</span>
              <small>EDUCATION HUB</small>
            </div>
          </Link>

          <nav className="desktop-nav">
            <Link to="/" onClick={closeMenu}>Home</Link>
            {renderCatalogueLinks()}
            <Link to="/subscriptions" onClick={closeMenu}>Subscriptions</Link>
            <Link to="/about" onClick={closeMenu}>About</Link>
            <Link to="/contact" onClick={closeMenu}>Contact</Link>
          </nav>

          <div className="navbar-actions">
            {authenticated ? (
              <>
                <Link
                  to="/student"
                  className="dashboard-button"
                  onClick={closeMenu}
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="login-button"
                  onClick={closeMenu}
                >
                  <UserRound size={17} />
                  Profile
                </Link>
                <button
                  type="button"
                  className="login-button"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-button" onClick={closeMenu}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="register-button"
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav">
            <Link to="/" onClick={closeMenu}>Home</Link>
            {renderCatalogueLinks()}
            <Link to="/subscriptions" onClick={closeMenu}>Subscriptions</Link>
            <Link to="/about" onClick={closeMenu}>About</Link>
            <Link to="/contact" onClick={closeMenu}>Contact</Link>

            {authenticated ? (
              <>
                <Link to="/student" className="dashboard-button" onClick={closeMenu}>
                  <LayoutDashboard size={17} />
                  Dashboard
                </Link>
                <Link to="/profile" className="login-button" onClick={closeMenu}>
                  <UserRound size={17} />
                  Profile
                </Link>
                <button
                  type="button"
                  className="login-button"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="mobile-actions">
                <Link to="/login" className="login-button" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="register-button" onClick={closeMenu}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </Container>
    </header>
  );
};

export default Navbar;