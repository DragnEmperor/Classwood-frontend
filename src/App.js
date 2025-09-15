import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

import SuccessToast from "./components/UI/SuccessToast";
import WarningToast from "./components/UI/WarningToast";
import ProtectedRoute from "./components/Common/ProtectedRoute";

import { loginUser, setSuccessToast, setProfileData } from "./store/generalUser";
import { useAccount } from "./api/hooks/useAccount";

// Student Pages
import StudentDashboard from "./components/Student/Dashboard";
import StudentSubjects from "./components/Student/Subjects";
import StudentTest from "./components/Student/Test";
import StudentFees from "./components/Student/FeesPayment";
import StudentChat from "./components/Student/Message";
import StudentNoticeFullPageView from "./components/Student/NoticeFullPageView";
import StudentEventFullPageView from "./components/Student/EventFullPageView";

// School Pages
import SchoolDashboard from "./components/School/Dashboard";
import AllStaff from "./components/School/Staff";
import AllStudent from "./components/School/Student";
import AllSubjects from "./components/School/AllSubjects";
import SchoolClassroom from "./components/School/Classroom";
import AddClass from "./components/School/AddClass";
import TestResult from "./components/School/Exam/main";
import Attendance from "./components/School/Attendance/Attendance";
import SchoolTimetable from "./components/School/Timetable/Timetable";
import FeesManagement from "./components/School/Fees/FeesManagement";
import SchoolNoticeFullPageView from "./components/School/NoticeFullPageView";
import SchoolEventFullPageView from "./components/School/EventFullPageView";

// Staff Pages
import StaffDashboard from "./components/Staff/Dashboard";
import StaffAllClassrooms from "./components/Staff/Classroom";
import SingleClassStudents from "./components/Staff/Students";
import StaffNoticeFullPageView from "./components/Staff/NoticeFullPageView";
import StaffEventFullPageView from "./components/Staff/EventFullPageView";
import StaffTestExam from "./components/Staff/Exam/main";
import StaffTimeTable from "./components/Staff/TimeTable/TimeTable";

import "./App.css";

const studentRoutes = [
  ["/student/dashboard", <StudentDashboard />],
  ["/student/subject", <StudentSubjects />],
  ["/student/test", <StudentTest />],
  ["/student/message", <StudentChat />],
  ["/student/fees", <StudentFees />],
  ["/student/notice/:id", <StudentNoticeFullPageView />],
  ["/student/event/:id", <StudentEventFullPageView />],
];

const schoolRoutes = [
  ["/school/dashboard", <SchoolDashboard />],
  ["/school/students", <AllStudent />],
  ["/school/staff", <AllStaff />],
  ["/school/classroom", <SchoolClassroom />],
  ["/school/subject", <AllSubjects />],
  ["/school/addclass", <AddClass />],
  ["/school/test", <TestResult />],
  ["/school/attendence", <Attendance />],
  ["/school/timetable", <SchoolTimetable />],
  ["/school/fees", <FeesManagement />],
  ["/school/notice/:id", <SchoolNoticeFullPageView />],
  ["/school/event/:id", <SchoolEventFullPageView />],
];

const staffRoutes = [
  ["/staff/dashboard", <StaffDashboard />],
  ["/staff/classroom", <StaffAllClassrooms />],
  ["/staff/students", <SingleClassStudents />],
  ["/staff/notice/:id", <StaffNoticeFullPageView />],
  ["/staff/event/:id", <StaffEventFullPageView />],
  ["/staff/test", <StaffTestExam />],
  ["/staff/timetable", <StaffTimeTable />],
];

export default function App() {
  const dispatch = useDispatch();
  const UserType = useSelector((state) => state.user.UserType);
  const currentUserType = UserType || localStorage.getItem("UserType") || "";
  const hasToken = !!localStorage.getItem("token");

  useEffect(() => {
    const storedUserType = localStorage.getItem("UserType");
    if (storedUserType && !UserType) {
      dispatch(loginUser(storedUserType));
    }
    if (UserType) {
      dispatch(setSuccessToast("Logged in successfully"));
    }
  }, [dispatch, UserType]);

  const { data: accountData } = useAccount({
    enabled: currentUserType === "School" && hasToken,
  });

  useEffect(() => {
    if (accountData) dispatch(setProfileData(accountData));
  }, [accountData, dispatch]);

  return (
    <Router>
      <SuccessToast />
      <WarningToast />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {studentRoutes.map(([path, element]) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute role="Student">{element}</ProtectedRoute>}
          />
        ))}

        {schoolRoutes.map(([path, element]) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute role="School" requirePaid>
                {element}
              </ProtectedRoute>
            }
          />
        ))}

        {staffRoutes.map(([path, element]) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute role="Staff">{element}</ProtectedRoute>}
          />
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
