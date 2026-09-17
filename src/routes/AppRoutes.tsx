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

const AppRoutes = () => {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/courses"
        element={<Courses />}
      />

      <Route
        path="/courses/:courseId"
        element={<CourseDetails />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/subscriptions"
        element={<Subscriptions />}
      />

      <Route
        path="/student"
        element={<Student />}
      />

      <Route
        path="/instructor"
        element={<Instructor />}
      />

      <Route
        path="/admin"
        element={<Admin />}
      />

    </Routes>
  );
};

export default AppRoutes;