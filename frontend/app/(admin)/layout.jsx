"use client"; // must be client for localStorage and router

import Script from "next/script";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminFooter from "../components/admin/AdminFooter";
import { AuthProvider } from "../context/AuthContext";
import AdminAssets from "../components/admin/AdminAssets";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Set page title
  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  // Auth Guard
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.replace("/login"); // redirect if no token
    } else {
      setLoading(false); // token exists → show dashboard
    }
  }, [router]);

  // Show loading spinner while checking token
  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If loading is false → render dashboard
  return (
    <AuthProvider>
      <div className="app-wrapper">
        <AdminAssets />
        <AdminNavbar />
        <AdminSidebar />
        {children}
        <AdminFooter />
      </div>
    </AuthProvider>
  );
}
