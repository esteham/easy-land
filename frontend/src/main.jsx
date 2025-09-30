import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Dashboard from "./components/dashboard/admin/Dashboard";
import UserDashboard from "./components/dashboard/user/Dashboard";
import ManagerPage from "./components/dashboard/acland/Dashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RoleRoute allow={["admin"]}>
                <Dashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <RoleRoute allow={["acland"]}>
                <ManagerPage />
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

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
