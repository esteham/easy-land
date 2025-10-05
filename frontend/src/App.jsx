import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import RoleRoute from "./auth/RoleRoute";

import MainLayout from "./components/layout/MainLayout";
import LandExplorer from "./components/pages/LandExplorer";

import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import HomePage from "./components/pages/HomePage";
import ResetPassword from "./components/pages/ResetPassword";
import ForgotPassword from "./components/pages/ForgotPassword";

import AdminLayout, { AdminHome } from "./components/dashboard/admin/Dashboard";
import AdminDivisions from "./components/dashboard/admin/AdminDivisions";
import AdminDistricts from "./components/dashboard/admin/AdminDistricts";
import AdminUpazilas from "./components/dashboard/admin/AdminUpazilas";
import AdminMouzas from "./components/dashboard/admin/AdminMouzas";
import AdminZils from "./components/dashboard/admin/AdminZils";
import AdminDags from "./components/dashboard/admin/AdminDags";

import UserDashboard from "./components/dashboard/user/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: { fontSize: "14px", borderRadius: "10px" },
            success: { icon: "✅" },
            error: { icon: "⚠️" },
          }}
        />
        <Routes>
          {/* Public routes with header & footer */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />

          <Route
            path="/login"
            element={
              <MainLayout>
                <Login />
              </MainLayout>
            }
          />

          <Route
            path="/register"
            element={
              <MainLayout>
                <Register />
              </MainLayout>
            }
          />

          <Route
            path="/land"
            element={
              <MainLayout>
                <LandExplorer />
              </MainLayout>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <MainLayout>
                <ForgotPassword />
              </MainLayout>
            }
          />

          <Route
            path="/reset-password"
            element={
              <MainLayout>
                <ResetPassword />
              </MainLayout>
            }
          />

          {/* --- ADMIN: No header/footer (uses sidebar layout) --- */}
          <Route
            path="/admin"
            element={
              <RoleRoute allow={["admin", "acland"]}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="divisions" element={<AdminDivisions />} />
            <Route path="districts" element={<AdminDistricts />} />
            <Route path="upazilas" element={<AdminUpazilas />} />
            <Route path="mouzas" element={<AdminMouzas />} />
            <Route path="zils" element={<AdminZils />} />
            <Route path="dags" element={<AdminDags />} />
          </Route>

          {/* User dashboard - NOW WITH header/footer */}
          <Route
            path="/dashboard"
            element={
              <RoleRoute allow={["user", "acland", "admin"]}>
                <MainLayout>
                  <UserDashboard />
                </MainLayout>
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
