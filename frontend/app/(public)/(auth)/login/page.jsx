"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import "./login.css"; // 👈 create this CSS file next to your component

export default function LoginPage() {
  const router = useRouter();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        if (data.roles)
          localStorage.setItem("roles", JSON.stringify(data.roles));
        if (data.permissions)
          localStorage.setItem("permissions", JSON.stringify(data.permissions));

        setSuccess("Login successful!");
        login(data.token, data.user.name, data.roles, data.permissions);
        router.replace("/dashboard");
      } else {
        setError(data.error || "Invalid login credentials");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-bg d-flex align-items-center justify-content-center vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body">
            <img
              src="/src/assets/img/companyLogo.png"
              alt="Logo"
              className="img-fluid company-logo desktop-device mobile-device centered"
            />
            <h4 className="text-center mb-4">Welcome to Deshremit</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-bold">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>

              {error && (
                <p className="text-danger mt-3  text-center">{error}</p>
              )}
              {success && (
                <p className="text-success mt-3  text-center">{success}</p>
              )}
            </form>
          </div>
        </div>
      </div>
      <style jsx>{`
        .company-logo {
          height: 140px;
          width: 50%;
          object-fit: contain;
        }

        @media (max-width: 768px) {
          .company-logo.mobile-device {
            width: 70%;
            height: auto;
          }
        }
        .centered {
          display: block;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
