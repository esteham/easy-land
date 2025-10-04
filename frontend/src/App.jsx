import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import RoleRoute from "./auth/RoleRoute";

import HomePage from "./components/pages/HomePage";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";

import AdminLayout, { AdminHome } from "./components/dashboard/admin/Dashboard";
import LandExplorer from "./components/pages/LandExplorer";
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

          {/* --- ADMIN: parent layout keeps the sidebar persistent --- */}
          <Route
            path="/admin"
            element={
              <RoleRoute allow={["admin", "acland"]}>
                <AdminLayout /> {/* <-- has the sidebar + <Outlet/> */}
              </RoleRoute>
            }
          >
            {/* RIGHT SIDE CONTENT renders here */}
            <Route index element={<AdminHome />} />
            <Route path="divisions" element={<AdminDivisions />} />
            <Route path="districts" element={<AdminDistricts />} />
            <Route path="upazilas" element={<AdminUpazilas />} />
            <Route path="mouzas" element={<AdminMouzas />} />
            <Route path="zils" element={<AdminZils />} />
            <Route path="dags" element={<AdminDags />} />
          </Route>



          {/* User dashboard (unchanged) */}
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
