
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  ArrowRight,
  Info,
} from "lucide-react";
import EducatorNavbar from "../EducatorComponents/EducatorNavbar";
import EducatorFooter from "../EducatorComponents/EducatorFooter";
import "./EducatorWorkspace.scss";

type EducatorUser = {
  role?: string;
  fullName?: string;
  name?: string;
  username?: string;
  email?: string;
};

export default function MyTeaching() {
  const [role, setRole] = useState("educator");

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("gracia_current_user");
      if (storedUser) {
        const user: EducatorUser = JSON.parse(storedUser);
        const currentRole = String(user.role || "").toLowerCase();
        setRole(
          currentRole === "teacher" || currentRole === "tutor"
            ? currentRole
            : "educator"
        );
      }
    } catch {
      setRole("educator");
    }
  }, []);

  const isTeacher = role === "teacher";
  const isTutor = role === "tutor";

  const heading = isTeacher
    ? "My Subjects"
    : isTutor
      ? "My Courses"
      : "My Teaching";

  const description = isTeacher
    ? "View and manage the Primary and Secondary subjects assigned to you."
    : isTutor
      ? "View and manage the Tertiary and Practical Skills courses assigned to you."
      : "Your assigned teaching subjects or courses will appear here.";

  return (
    <div className="educator-workspace">
      <EducatorNavbar />

      <main className="educator-workspace__main">
        <div className="educator-workspace__breadcrumb">
          <Link to="/educator">Dashboard</Link>
          <span>/</span>
          <span>My Teaching</span>
        </div>

        <section className="educator-workspace__heading">
          <div className="educator-workspace__heading-icon">
            {isTeacher ? (
              <BookOpen size={26} />
            ) : (
              <GraduationCap size={26} />
            )}
          </div>

          <div>
            <p className="educator-workspace__eyebrow">
              EDUCATOR WORKSPACE
            </p>
            <h1>{heading}</h1>
            <p className="educator-workspace__description">
              {description}
            </p>
          </div>
        </section>

        <section className="educator-workspace__panel">
          <div className="educator-workspace__panel-heading">
            <div>
              <h2>{heading}</h2>
              <p>
                Assigned teaching records will be displayed here when
                available from Gracia's backend.
              </p>
            </div>
          </div>

          <div className="educator-workspace__empty">
            <div className="educator-workspace__empty-icon">
              <BookOpen size={30} />
            </div>
            <h3>No teaching records loaded</h3>
            <p>
              This page is ready for your assigned{" "}
              {isTeacher ? "subjects" : isTutor ? "courses" : "teaching records"}.
              It is not yet connected to an assignment endpoint, so no
              teaching records are shown here.
            </p>
            <Link
              to="/educator"
              className="educator-workspace__button"
            >
              Return to Dashboard <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <div className="educator-workspace__notice">
          <Info size={19} />
          <p>
            Gracia keeps school subjects separate from Tertiary and
            Practical Skills courses. Only records assigned to the
            signed-in educator should appear here.
          </p>
        </div>
      </main>

      <EducatorFooter />
    </div>
  );
}
