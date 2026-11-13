
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Info,
  ArrowRight,
} from "lucide-react";
import EducatorNavbar from "../EducatorComponents/EducatorNavbar";
import EducatorFooter from "../EducatorComponents/EducatorFooter";
import "./EducatorWorkspace.scss";

export default function EducatorNotifications() {
  return (
    <div className="educator-workspace">
      <EducatorNavbar />

      <main className="educator-workspace__main">
        <div className="educator-workspace__breadcrumb">
          <Link to="/educator">Dashboard</Link>
          <span>/</span>
          <span>Notifications</span>
        </div>

        <section className="educator-workspace__heading">
          <div className="educator-workspace__heading-icon">
            <Bell size={26} />
          </div>
          <div>
            <p className="educator-workspace__eyebrow">
              UPDATES AND ALERTS
            </p>
            <h1>Notifications</h1>
            <p className="educator-workspace__description">
              Keep track of relevant updates about your teaching
              activities and online classes.
            </p>
          </div>
        </section>

        <section className="educator-workspace__panel">
          <div className="educator-workspace__panel-heading">
            <div>
              <h2>Your notifications</h2>
              <p>
                Notifications will be displayed here when retrieved
                from Gracia's notification service.
              </p>
            </div>
            <span className="educator-workspace__status">
              <CheckCheck size={15} />
              No unread count available
            </span>
          </div>

          <div className="educator-workspace__empty">
            <div className="educator-workspace__empty-icon">
              <Bell size={30} />
            </div>
            <h3>No notifications loaded</h3>
            <p>
              There are no notification records being displayed.
              This does not confirm that your account has no
              notifications; the page still needs to retrieve them
              from the backend.
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
            The backend integration will determine which notifications
            belong to the signed-in educator. Read/unread status and
            notification actions should be saved by the backend, not
            simulated in the browser.
          </p>
        </div>
      </main>

      <EducatorFooter />
    </div>
  );
}
