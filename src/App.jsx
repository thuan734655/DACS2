import ForgottenUI from "./components/ui/ForgottenUI";
import HomePageUI from "./components/ui/HomePageUI";
import LoginUI from "./components/ui/LoginUI";
import ProfileUI from "./components/ui/ProfileUI";
import SignUp from "./components/ui/SignUp";
import NotificationPage from "./pages/NotificationPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { initializeSocket } from "./services/socketService";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useEffect(() => {
    initializeSocket();
  }, []);

  return (
    <ToastProvider>
      <div>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LoginUI />} />
            <Route path="/login" element={<LoginUI />} />
            <Route path="/forgotten" element={<ForgottenUI />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route
              path="/homepage"
              element={
                <ProtectedRoute>
                  <HomePageUI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <ProfileUI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileUI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </ToastProvider>
  );
}

export default App;
