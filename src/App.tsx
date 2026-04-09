/** @format */

import { BrowserRouter as Router, Routes, Route } from "react-router";
// import { AuthProvider } from "@/context/AuthContext";
import SignIn from "@/pages/AuthPages/SignIn";
// import ResetPassword from "@/pages/AuthPages/ResetPassword";
// import SignUp from "@/pages/AuthPages/SignUp";
import NotFound from "@/pages/OtherPage/NotFound";
import UserProfiles from "@/pages/UserProfiles";
// import Blank from './pages/Blank';
import AppLayout from "@/layout/AppLayout";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import Home from "@/pages/Dashboard/Home";
import { AuthProvider } from "./context/AuthContext";
// import Roles from "@/pages/Roles/Role";
import PrivateRoute from "@/components/auth/PrivateRoute";
// import RoleRoute from "@/components/auth/RoleRoute";
// import Users from "./pages/Users/Users";
// import Students from "./pages/Students/Students";
// import Lecturer from "./pages/Lecturers/Lecturer";
// import Course from "./pages/Courses/Course";
// import Role from "@/pages/Roles/Role";
// import Batch from "./pages/Batches/Batch";
// import FormElements from "./pages/Forms/FormElements";
// import Rating from "./pages/Ratings/Admin/Rating";
// import LecturerRating from "./pages/Ratings/Lecturers/Rating";
// import StudentRating from "./pages/Ratings/Students/Rating";
// import LecturerBatch from "./pages/Batches/lecturer/Batch"
// import DayOutline from "./pages/Batches/lecturer/DayOutline";
// import StudentCourses from "./pages/StudentCourses/StudentCourses";
// import StudentDailyOutlines from "./pages/StudentCourses/DailyOutlines";
// import StudentSchedules from "./pages/StudentSchedule/Calendar";
// import AllCourses from "./pages/AllCourses/AllCourses";
// import LecturerSchedules from "@/pages/LectureSchedules/Schedules";

export default function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout */}
            <Route
              element={
                <PrivateRoute>
                  <AppLayout />
                </PrivateRoute>
              }
            >
              <Route index path="/" element={<Home />} />
              {/* <Route
                index
                path="/roles"
                element={
                  <RoleRoute allowedRoles={["admin"]}>
                    <Role />
                  </RoleRoute>
                }
              /> */}


              <Route path="/profile" element={<UserProfiles />} />

              {/* <Route path="/blank" element={<Blank />} /> */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            {/* <Route path="/forgot-password" element={<ResetPassword />} /> */}
            {/* <Route path="/signup" element={<SignUp />} /> */}
            {/* <Route path="/form-elements" element={<FormElements />} /> */}
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
