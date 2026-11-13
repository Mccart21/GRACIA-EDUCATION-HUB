
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  ShieldCheck,
  Info,
} from "lucide-react";
import EducatorNavbar from "../EducatorComponents/EducatorNavbar";
import EducatorFooter from "../EducatorComponents/EducatorFooter";
import "./EducatorWorkspace.scss";

type EducatorUser = {
  id?: number | string;
  fullName?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: string;
  bio?: string;
  level?: string;
};

export default function EducatorProfile() {
  const [user, setUser] = useState<EducatorUser>({});

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("gracia_current_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as EducatorUser);
      }
    } catch {
      setUser({});
    }
  }, []);

  const name =
    user.fullName || user.name || user.username || "Educator";

  const role = String(user.role || "Educator");
  const formattedRole =
    role.length > 0
      ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
      : "Educator";

  return (
    <div className="educator-workspace">
      <EducatorNavbar />

      <main className="educator-workspace__main">
        <div className="educator-workspace__breadcrumb">
          <Link to="/educator">Dashboard</Link>
          <span>/</span>
          <span>My Profile</span>
        </div>

        <section className="educator-workspace__heading">
          <div className="educator-workspace__heading-icon">
            <UserRound size={26} />
          </div>
          <div>
            <p className="educator-workspace__eyebrow">
              ACCOUNT INFORMATION
            </p>
            <h1>My Profile</h1>
            <p className="educator-workspace__description">
              View the educator information currently available
              for your account.
            </p>
          </div>
        </section>

        <section className="educator-workspace__profile-card">
          <div className="educator-workspace__profile-avatar">
            <UserRound size={38} />
          </div>
          <div className="educator-workspace__profile-summary">
            <h2>{name}</h2>
            <p>{user.email || "Email not available"}</p>
            <span className="educator-workspace__role-badge">
              <ShieldCheck size={15} />
              {formattedRole}
            </span>
          </div>
        </section>

        <section className="educator-workspace__panel">
          <div className="educator-workspace__panel-heading">
            <div>
              <h2>Personal and account details</h2>
              <p>
                Information below comes from the locally stored
                signed-in user record, when available.
              </p>
            </div>
          </div>

          <div className="educator-workspace__details-grid">
            <div className="educator-workspace__detail">
              <span>
                <UserRound size={17} />
                Full name
              </span>
              <strong>{name}</strong>
            </div>

            <div className="educator-workspace__detail">
              <span>
                <Mail size={17} />
                Email address
              </span>
              <strong>{user.email || "Not available"}</strong>
            </div>

            <div className="educator-workspace__detail">
              <span>
                <Phone size={17} />
                Phone number
              </span>
              <strong>{user.phone || "Not available"}</strong>
            </div>

            <div className="educator-workspace__detail">
              <span>
                <ShieldCheck size={17} />
                Educator role
              </span>
              <strong>{formattedRole}</strong>
            </div>

            <div className="educator-workspace__detail">
              <span>
                <UserRound size={17} />
                Teaching level
              </span>
              <strong>{user.level || "Not available"}</strong>
            </div>

            <div className="educator-workspace__detail">
              <span>
                <Info size={17} />
                Profile description
              </span>
              <strong>{user.bio || "Not available"}</strong>
            </div>
          </div>
        </section>

        <div className="educator-workspace__notice">
          <Info size={19} />
          <p>
            This is a read-only view of locally stored account details.
            Profile updates, server-side validation, and refreshing
            the profile from the authenticated API have not been
            connected yet.
          </p>
        </div>
      </main>

      <EducatorFooter />
    </div>
  );
}
