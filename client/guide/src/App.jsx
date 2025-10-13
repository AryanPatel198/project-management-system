import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Common
import WelcomePage from "./pages/WelcomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

// -------------------- ADMIN PAGES --------------------
import Login from "./pages/admin/Login";
import Register from "./pages/admin/Register";
import AdminHome from "./pages/admin/Home";
import GuideManagement from "./pages/admin/GuideManagement";
import GroupManagement from "./pages/admin/GroupManagement";
import Settings from "./pages/admin/Settings";
import EvaluationParameters from "./pages/admin/EvaluationParameters";
import ProjectManagement from "./pages/admin/ProjectManagement";
import ManageDivisions from "./pages/admin/ManageDivisions";
import ExamScheduleManagement from "./pages/admin/ExamScheduleManagement";

// -------------------- GUIDE PAGES --------------------
import GuideLogin from "./pages/guide/GuideLogin";
import GuideRegister from "./pages/guide/GuideRegister";
import GuideDashboard from "./pages/guide/GuideDashboard";
import Profile from "./pages/guide/Profile.jsx";
import GuideGroupManagement from "./pages/guide/GroupManagement";
import ProjectApproval from "./pages/guide/ProjectApproval";
import Feedback from "./pages/guide/Feedback";

import ProjectEvaluation from "./pages/guide/ProjectEvaluation";

// -------------------- STUDENT PAGES --------------------
import StudentLogin from "./pages/student/Login";
import StudentRegister from "./pages/student/Register";
import StudentHome from "./pages/student/Home";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentGroupManagement from "./pages/student/GroupManagement";
import StudentSettings from "./pages/student/Settings";
import StudentProjectSubmission from "./pages/student/ProjectSubmission";
import StudentFeedback from "./pages/student/Feedback";
import StudentAnnouncements from "./pages/student/Announcements";
import StudentExamSchedules from "./pages/student/ExamSchedules";
import StudentGuideDetails from "./pages/student/GuideDetails";
import StudentProfile from "./pages/student/StudentProfile";
import StudentGroupChat from "./pages/student/GroupChat";
import StudentProjectManagement from "./pages/student/ProjectManagement";



// -------------------- 404 PAGE --------------------
const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-lg mb-4">The page you are looking for does not exist.</p>
    <a
      href="/"
      className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-opacity-90 transition duration-200"
    >
      Go to Welcome Page
    </a>
  </div>
);

function App() {
  useEffect(() => {
    console.log("App.jsx mounted");
  }, []);

  return (
    <Router>
      <Routes>
        {/* -------------------- WELCOME -------------------- */}
        <Route path="/" element={<WelcomePage />} />

        {/* -------------------- ADMIN ROUTES -------------------- */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/guides"
          element={
            <ProtectedRoute>
              <GuideManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/groups"
          element={
            <ProtectedRoute>
              <GroupManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <ProjectManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/evaluation-parameters"
          element={
            <ProtectedRoute>
              <EvaluationParameters />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/divisions"
          element={
            <ProtectedRoute>
              <ManageDivisions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schedules"
          element={
            <ProtectedRoute>
              <ExamScheduleManagement />
            </ProtectedRoute>
          }
        />
        {/* Default redirect for /admin → home */}
        <Route path="/admin" element={<Navigate to="/admin/home" replace />} />

        {/* -------------------- GUIDE ROUTES -------------------- */}
        <Route path="/guide/login" element={<GuideLogin />} />
        <Route path="/guide/register" element={<GuideRegister />} />
        <Route
          path="/guide/dashboard"
          element={
            <ProtectedRoute>
              <GuideDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guide/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide/groups"
          element={
            <ProtectedRoute>
              <GuideGroupManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide/projects"
          element={
            <ProtectedRoute>
              <ProjectApproval />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guide/evaluation"
          element={
            <ProtectedRoute>
              <ProjectEvaluation />
            </ProtectedRoute>
          }
        />
        {/* Default redirect for /guide → dashboard */}
        <Route path="/guide" element={<Navigate to="/guide/dashboard" replace />} />

        {/* -------------------- STUDENT ROUTES -------------------- */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route
          path="/student/home"
          element={
            <ProtectedRoute>
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/project-submission"
          element={
            <ProtectedRoute>
              <StudentProjectSubmission />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/group-management"
          element={
            <ProtectedRoute>
              <StudentGroupManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/feedback"
          element={
            <ProtectedRoute>
              <StudentFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/announcements"
          element={
            <ProtectedRoute>
              <StudentAnnouncements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/exam-schedules"
          element={
            <ProtectedRoute>
              <StudentExamSchedules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/guide-details"
          element={
            <ProtectedRoute>
              <StudentGuideDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/group-chat"
          element={
            <ProtectedRoute>
              <StudentGroupChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/project-management"
          element={
            <ProtectedRoute>
              <StudentProjectManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/settings"
          element={
            <ProtectedRoute>
              <StudentSettings />
            </ProtectedRoute>
          }
        />
        {/* Default redirect for /student → dashboard */}
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />

        {/* -------------------- GENERIC -------------------- */}
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
