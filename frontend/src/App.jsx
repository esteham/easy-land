import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import RoleRoute from "./auth/RoleRoute";

import HomePage from "./components/pages/HomePage";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Dashboard from "./components/dashboard/admin/Dashboard";
import UserDashboard from "./components/dashboard/user/Dashboard";
import AcLandPage from "./components/dashboard/acland/Dashboard";
import LandExplorer from "./components/pages/LandExplorer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/land" element={<LandExplorer />} />

          <Route
            path="/admin"
            element={
              <RoleRoute allow={["admin"]}>
                <Dashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/acLand"
            element={
              <RoleRoute allow={["acland"]}>
                <AcLandPage />
              </RoleRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RoleRoute allow={["user", "acland", "admin"]}>
                <UserDashboard />
              </RoleRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
