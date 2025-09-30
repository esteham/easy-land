import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import Dashboard from "./components/dashboard/admin/Dashboard";

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
                <AdminPage />
              </RoleRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <RoleRoute allow={["manager"]}>
                <ManagerPage />
              </RoleRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RoleRoute allow={["user", "manager", "admin"]}>
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
