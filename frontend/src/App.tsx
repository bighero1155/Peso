import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import UserManagement from "./components/Users/UserManagement";
import Login from "./pages/Login";
import Register from "./components/Users/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Intro from "./pages/Intro";
import StudentProfile from "./pages/StudentProfile";
import Dashboard from "./components/Users/Dashboard";
import "./styles/responsive.css";
import AdminDashboard from "./Admin/AdminDashboard";
import PesoLanding from "./pesolanding/peso";
import EmployerJobsPage from "./components/Jobs/EmployerJobsPage";
import JobApplicantsPage from "./components/Jobs/JobApplicantsPage";
import ApplicantJobsPage from "./components/Jobs/ApplicantJobsPage";
import MyApplicationsPage from "./components/Jobs/MyApplicationsPage";
import ContactPage from "./pages/ContactPage";
import VerifyEmail from "./pages/verifyemail";

// ---------------------------
// PIXELATED LOADING SCREEN
// ---------------------------
const Loading: React.FC = () => {
  const styles: Record<string, React.CSSProperties> = {
    screen: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(26, 26, 26, 0.95)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      fontFamily: "'Press Start 2P', monospace",
      color: "#00ffcc",
      imageRendering: "pixelated",
      flexDirection: "column",
      textAlign: "center",
    },
    loader: {
      display: "flex",
      gap: "6px",
      marginBottom: "20px",
    },
    pixel: {
      width: "20px",
      height: "20px",
      backgroundColor: "#00ffcc",
      animation: "blink 1s infinite",
      imageRendering: "pixelated",
    },
    text: {
      fontSize: "14px",
      color: "#00ffcc",
      textShadow: "0 0 6px #00ffcc",
    },
  };

  const styleTag = `
    @keyframes blink {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div style={styles.screen}>
        <div style={styles.loader}>
          <div style={{ ...styles.pixel, animationDelay: "0s" }} />
          <div style={{ ...styles.pixel, animationDelay: "0.2s" }} />
          <div style={{ ...styles.pixel, animationDelay: "0.4s" }} />
          <div style={{ ...styles.pixel, animationDelay: "0.6s" }} />
        </div>
        <p style={styles.text}>Loading...</p>
      </div>
    </>
  );
};

// ---------------------------
// ROUTER
// ---------------------------
const router = createBrowserRouter([
  { path: "/contact", element: <ContactPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // ── Email Verification ──────────────────────────────────────────────────
  { path: "/verify-email/success",          element: <VerifyEmail /> },
  { path: "/verify-email/error",            element: <VerifyEmail /> },
  { path: "/verify-email/already-verified", element: <VerifyEmail /> },

  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={["employer", "admin"]}>
        <>
          <Navbar />
          <UserManagement />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/employer/jobs",
    element: (
      <ProtectedRoute allowedRoles={["employer", "admin"]}>
        <EmployerJobsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employer/jobs/:jobId/applicants",
    element: (
      <ProtectedRoute allowedRoles={["employer", "admin"]}>
        <JobApplicantsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jobs",
    element: (
      <ProtectedRoute allowedRoles={["applicant"]}>
        <ApplicantJobsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-applications",
    element: (
      <ProtectedRoute allowedRoles={["applicant"]}>
        <MyApplicationsPage /> 
      </ProtectedRoute>
    ),
  },
  {
    path: "/landing",
    element: (
      <ProtectedRoute allowedRoles={["applicant", "employer", "admin"]}>
        <>
          <LandingPage />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={["applicant", "employer", "admin"]}>
        <StudentProfile />
      </ProtectedRoute>
    ),
  },
  { path: "/intro", element: <Intro /> },
  { path: "/", element: <PesoLanding /> },
  { path: "*", element: <NotFound /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["applicant", "employer", "admin"]}>
        <>
          <Navbar />
          <Dashboard />
        </>
      </ProtectedRoute>
    ),
  },
  {
    path: "/Admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <>
          <AdminDashboard />
        </>
      </ProtectedRoute>
    ),
  },
]);

// ---------------------------
// APP COMPONENT
// ---------------------------
const App: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 300);

    const handleApiLoading = (e: Event) => {
      const customEvent = e as CustomEvent<{ isLoading: boolean }>;
      setApiLoading(customEvent.detail.isLoading);
    };

    window.addEventListener("apiLoading", handleApiLoading);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("apiLoading", handleApiLoading);
    };
  }, []);

  return (
    <>
      {(initialLoading || apiLoading) && <Loading />}
      {!initialLoading && <RouterProvider router={router} />}
    </>
  );
};

export default App;