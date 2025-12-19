"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiGet } from "../../../lib/apiGet";

import Link from "next/link";
export default function AdminNavbar() {
  const { token, logout, username, roles } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bankrate, setBankrate] = useState("");

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    window.location.href = "/login";
  };

  const capitalizeFirst = (value) => {
    if (!value) return "";
    const str = String(value);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const fetchData = async () => {
    const result = await apiGet({
      endpoint: "/setting/checkedWalletforAgent",
      token,
    });

    if (result.success) {
      setUser(result.data);
      setBankrate(result.data.bankrate);
    } else {
      console.error("Fetch failed:", result.error);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  return (
    <nav className="app-header navbar navbar-expand bg-body">
      <div className="container-fluid">
        {/* Left side */}
        <ul className="navbar-nav align-items-center">
          {/* Sidebar toggle */}
          <li className="nav-item">
            <a
              className="nav-link"
              data-lte-toggle="sidebar"
              href="#"
              role="button"
            >
              <i className="bi bi-list" />
            </a>
          </li>

          {/* Refresh link */}
          <li className="nav-item d-none d-md-block d-none">
            <a
              href="#"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
            >
              Refresh
            </a>
          </li>

          {/* Wallet Amount */}
          <li className="nav-item ms-md-3">
            <div className="d-flex align-items-center">
              {/* Desktop only label */}
              <span
                className="fw-bold me-2 d-none d-md-inline"
                style={{ width: "150px" }}
              >
                Todays Rate:
              </span>

              {/* Rate boxes */}
              <div className="d-flex gap-2 justify-content-center justify-content-md-start">
                {/* Wallet */}
                <div
                  className="d-flex justify-content-center align-items-center bg-danger text-white fw-bold animate__animated animate__pulse"
                  style={{
                    height: "40px",
                    fontSize: "16px", // slightly smaller for mobile
                    borderRadius: "6px",
                    padding: "0 10px", // instead of width
                    whiteSpace: "nowrap", // stay inline
                  }}
                >
                  Wallet: {user?.amount ?? 0}
                </div>

                {/* Bank */}
                <div
                  className="d-flex justify-content-center align-items-center bg-primary text-white fw-bold animate__animated animate__pulse"
                  style={{
                    height: "40px",
                    fontSize: "16px",
                    borderRadius: "6px",
                    padding: "0 10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Bank: {bankrate ?? 0}
                </div>
              </div>
            </div>
          </li>
        </ul>

        {/* Right side */}
        <ul className="navbar-nav ms-auto">
          {/* User Dropdown */}
          <li
            className={`nav-item dropdown user-menu ${open ? "show" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <a href="#" className="nav-link dropdown-toggle">
              <img
                src="/src/assets/img/user2-160x160.jpg"
                className="user-image rounded-circle shadow"
                alt="User Image"
              />
              <span className="d-none d-md-inline">
                {capitalizeFirst(username)}
              </span>
            </a>
            <ul
              className={`dropdown-menu dropdown-menu-lg dropdown-menu-end ${
                open ? "show" : ""
              }`}
              style={{ right: 0, left: "auto" }}
            >
              {/*begin::User Image*/}
              <li className="user-header text-bg-primary">
                <img
                  src="/src/assets/img/user2-160x160.jpg"
                  className="rounded-circle shadow"
                  alt="User Image"
                />
                <p>
                  {capitalizeFirst(username)}
                  <small>{capitalizeFirst(roles)}</small>
                </p>
              </li>
              <li className="user-footer">
                <Link href="/profile" className="btn btn-default btn-flat">
                  Profile
                </Link>
                <a
                  href="#"
                  className="btn btn-default btn-flat float-end"
                  onClick={handleLogout}
                >
                  Sign out
                </a>
              </li>
              {/*end::Menu Footer*/}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
