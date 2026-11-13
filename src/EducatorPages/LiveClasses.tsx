
import { Link } from "react-router-dom";
import {
  Video,
  CalendarDays,
  Clock,
  ExternalLink,
  Info,
} from "lucide-react";
import EducatorNavbar from "../EducatorComponents/EducatorNavbar";
import EducatorFooter from "../EducatorComponents/EducatorFooter";
import "./EducatorWorkspace.scss";

export default function LiveClasses() {
  return (
    <div className="educator-workspace">
      <EducatorNavbar />

      <main className="educator-workspace__main">
        <div className="educator-workspace__breadcrumb">
          <Link to="/educator">Dashboard</Link>
          <span>/</span>
          <span>Live Classes</span>
        </div>

        <section className="educator-workspace__heading">
          <div className="educator-workspace__heading-icon">
            <Video size={26} />
          </div>
          <div>
            <p className="educator-workspace__eyebrow">
              ONLINE CLASSROOM
            </p>
            <h1>Live Classes</h1>
            <p className="educator-workspace__description">
              View your scheduled online classes and access the
              appropriate virtual classroom when it is available.
            </p>
          </div>
        </section>

        <section className="educator-workspace__stats">
          <article className="educator-workspace__stat">
            <span className="educator-workspace__stat-icon">
              <CalendarDays size={22} />
            </span>
            <div>
              <span>Scheduled classes</span>
              <strong>—</strong>
            </div>
          </article>

          <article className="educator-workspace__stat">
            <span className="educator-workspace__stat-icon">
              <Clock size={22} />
            </span>
            <div>
              <span>Next class</span>
              <strong>Not available</strong>
            </div>
          </article>
        </section>

        <section className="educator-workspace__panel">
          <div className="educator-workspace__panel-heading">
            <div>
              <h2>My scheduled classes</h2>
              <p>
                Only classes returned by the connected scheduling
                service should appear here.
              </p>
            </div>
          </div>

          <div className="educator-workspace__empty">
            <div className="educator-workspace__empty-icon">
              <Video size={30} />
            </div>
            <h3>No scheduled classes available</h3>
            <p>
              Class scheduling and classroom access have not yet been
              connected to this page. No meeting has been created.
            </p>
            <Link
              to="/educator/my-teaching"
              className="educator-workspace__button"
            >
              View My Teaching
            </Link>
          </div>
        </section>

        <section className="educator-workspace__panel">
          <div className="educator-workspace__panel-heading">
            <div>
              <h2>Virtual classroom</h2>
              <p>
                BigBlueButton is the planned live-class platform.
              </p>
            </div>
            <span className="educator-workspace__status">
              Integration pending
            </span>
          </div>

          <div className="educator-workspace__integration">
            <div className="educator-workspace__integration-icon">
              <Video size={25} />
            </div>
            <div>
              <h3>BigBlueButton</h3>
              <p>
                Once configured, Gracia's backend can securely create
                or retrieve classroom sessions and provide authorized
                educators with their room links.
              </p>
            </div>
          </div>
        </section>

        <div className="educator-workspace__notice">
          <Info size={19} />
          <p>
            Meeting creation, joining, scheduling, and room permissions
            are not active yet. We will connect these features through
            the NestJS backend after BigBlueButton server credentials
            and configuration are available.
          </p>
          <ExternalLink size={17} />
        </div>
      </main>

      <EducatorFooter />
    </div>
  );
}
