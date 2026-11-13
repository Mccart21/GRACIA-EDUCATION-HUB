
import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Courses from "../pages/courses/Courses";
import CourseDetails from "../pages/courseDetails/CourseDetails";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Subscriptions from "../pages/subscriptions/Subscriptions";
import Student from "../pages/student/Student";
import Instructor from "../pages/instructor/Instructor";
import Admin from "../pages/admin/Admin";
import Payments from "../pages/payment/payments";
import Subjects from "../pages/subjects/Subjects";
import VerifyEmail from "../pages/verifyEmail/VerifyEmail";
import Profile from "../pages/profile/Profile";

import EducatorLogin from "../EducatorPages/EducatorLogin";
import EducatorPage from "../EducatorPages/EducatorPage";
import EducatorAbout from "../EducatorPages/EducatorAbout";
import EducatorContact from "../EducatorPages/EducatorContact";

import MyTeaching from "../EducatorPages/MyTeaching";
import LearningMaterials from "../EducatorPages/LearningMaterials";
import LiveClasses from "../EducatorPages/LiveClasses";
import EducatorNotifications from "../EducatorPages/EducatorNotifications";
import EducatorProfile from "../EducatorPages/EducatorProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main pages */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route
        path="/courses/:courseId"
        element={<CourseDetails />}
      />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      {/* Student portal */}
      <Route path="/student" element={<Student />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/subjects" element={<Subjects />} />
      <Route
        path="/subscriptions"
        element={<Subscriptions />}
      />
      <Route path="/payments" element={<Payments />} />

      {/* Instructor and administration */}
      <Route path="/instructor" element={<Instructor />} />
      <Route path="/admin" element={<Admin />} />

      {/* Educator authentication */}
      <Route
        path="/educator-login"
        element={<EducatorLogin />}
      />

      {/* Educator dashboard */}
      <Route
        path="/educator"
        element={<EducatorPage />}
      />

      {/* Educator workspace pages */}
      <Route
        path="/educator/my-teaching"
        element={<MyTeaching />}
      />
      <Route
        path="/educator/learning-materials"
        element={<LearningMaterials />}
      />
      <Route
        path="/educator/live-classes"
        element={<LiveClasses />}
      />
      <Route
        path="/educator/notifications"
        element={<EducatorNotifications />}
      />
      <Route
        path="/educator/profile"
        element={<EducatorProfile />}
      />

      {/* Educator information pages */}
      <Route
        path="/educator/about"
        element={<EducatorAbout />}
      />
      <Route
        path="/educator/contact"
        element={<EducatorContact />}
      />
    </Routes>
  );
};

export default AppRoutes;
