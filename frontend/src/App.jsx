import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
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
import AdminDivisions from "./components/dashboard/admin/AdminDivisions";
import AdminDistricts from "./components/dashboard/admin/AdminDistricts";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000, // 5 sec auto close
            style: { fontSize: "14px", borderRadius: "10px" },
            success: { icon: "✅" },
            error: { icon: "⚠️" },
          }}
        />
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
            path="/admin/divisions"
            element={
              <RoleRoute allow={["admin"]}>
                <AdminDivisions />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/districts"
            element={
              <RoleRoute allow={["admin"]}>
                <AdminDistricts />
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
