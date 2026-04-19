import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import AttendanceCalendarPage from "./pages/AttendanceCalendarPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("authChanged", syncAuthState);
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("authChanged", syncAuthState);
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  /* ---------------- LOGOUT HANDLER ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("userName");

    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChanged"));
  };

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        onLogout={handleLogout}
      />

      <div className="container mx-auto p-4">
        <Routes>
          {/* ---------- PUBLIC LANDING ---------- */}
          <Route path="/" element={<LandingPage />} />

          {/* ---------- PROTECTED DASHBOARD ---------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* ---------- PROTECTED CALENDAR ---------- */}
          <Route
            path="/calendar/:subject"
            element={
              <ProtectedRoute>
                <AttendanceCalendarPage />
              </ProtectedRoute>
            }
          />

          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/forgot-password"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />}
          />
          <Route
            path="/reset-password"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage />}
          />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default App;
