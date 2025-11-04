// app/components/ClientNavbar.js
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function ClientNavbar() {
  const { isLoggedIn, logout, username } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 1000,
    transition: "transform 0.3s ease",
    transform: open ? "translateX(0)" : "translateX(-100%)",
    overflowY: "auto",
    padding: "2rem",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 900,
    display: open ? "block" : "none",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    fontSize: "1.2rem",
    cursor: "pointer",
    background: "transparent",
    border: "none",
  };

  const handleLinkClick = () => setOpen(false);

  return (
    <div>
      {/*=====Mobile Menu */}

      <div style={overlayStyle} onClick={() => setOpen(false)} />

      {/* Mobile Menu */}
      <div style={menuStyle}>
        {/* Close Button */}
        <button style={closeButtonStyle} onClick={() => setOpen(false)}>
          ✕
        </button>

        {/* Logo */}
        <div
          className="mobile-logo"
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <Link href="/">
            <img
              src="https://futuregenit.com/frontend/images/futuregenit-logo.png"
              alt="TechBiz"
              style={{ maxWidth: "150px" }}
            />
          </Link>
        </div>

        {/* Menu Links */}
        <ul style={{ listStyle: "none", padding: 0, textAlign: "center" }}>
          <li style={{ marginBottom: "1rem" }}>
            <Link href="/" onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <Link href="/about-us" onClick={handleLinkClick}>
              About Us
            </Link>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <Link href="/shop" onClick={handleLinkClick}>
              Shop
            </Link>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <Link href="/login" onClick={handleLinkClick}>
              Login
            </Link>
          </li>
        </ul>
      </div>

      {/*====Header Area==*/}
      <header className="vs-header header-layout1">
        {/* Header Top */}
        <div className="header-top">
          <div className="container">
            <div className="row align-items-center justify-content-between gy-1 text-center text-lg-start">
              <div className="col-lg-auto d-none d-lg-block">
                <p className="header-text">
                  <span className="fw-medium">Now Hiring:</span> Are you a
                  driven and motivated 1st Line IT Support Engineer?
                </p>
              </div>
              <div className="col-lg-auto">
                <div className="header-social style-white">
                  <span className="social-title">Follow Us On: </span>
                  <a href="#">
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter" />
                  </a>
                  <a href="#">
                    <i className="fab fa-instagram" />
                  </a>
                  <a href="#">
                    <i className="fab fa-behance" />
                  </a>
                  <a href="#">
                    <i className="fab fa-youtube" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="menu-top">
            <div className="row justify-content-between align-items-center gx-sm-0">
              <div className="col">
                <div className="header-logo">
                  <Link href="/">
                    <img
                      src="https://futuregenit.com/frontend/images/futuregenit-logo.png"
                      alt="TechBiz"
                      className="logo"
                      style={{ width: "200px" }} // adjust px as neede
                    />
                  </Link>
                </div>
              </div>
              <div className="col-auto header-info ">
                <div className="header-info_icon">
                  <i className="fas fa-phone-alt" />
                </div>
                <div className="media-body">
                  <span className="header-info_label">Call Anytime 24/7</span>
                  <div className="header-info_link">
                    <a href="tel:+26921562148">+8801915728982</a>
                  </div>
                </div>
              </div>
              <div className="col-auto header-info d-none d-lg-flex">
                <div className="header-info_icon">
                  <i className="fas fa-envelope" />
                </div>
                <div className="media-body">
                  <span className="header-info_label">Mail Us For Support</span>
                  <div className="header-info_link">
                    <a href="mailto:info@TechBiz.com">info@futuregenit.com</a>
                  </div>
                </div>
              </div>
              <div className="col-auto header-info d-none d-xl-flex">
                <div className="header-info_icon">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <div className="media-body">
                  <span className="header-info_label">Office Address</span>
                  <div className="header-info_link">
                    Road no: 78, House no-2, Gulsan-2, Dhaka, Bangladesh
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Menu Area */}
        <div className="sticky-wrapper">
          <div className="sticky-active">
            <div className="container">
              <div className="row align-items-center justify-content-between">
                <div className="col-auto">
                  <nav className="main-menu menu-style1 d-none d-lg-block">
                    <ul>
                      <li>
                        <Link href="/">
                          <span className="has-new-lable">Home</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/about-us">About Us</Link>
                      </li>
                      <li>
                        <Link href="#">Services</Link>
                      </li>
                      <li>
                        <Link href="/login">Login</Link>
                      </li>
                    </ul>
                  </nav>
                  <button className="vs-menu-toggle d-inline-block d-lg-none">
                    <i className="fal fa-bars" onClick={() => setOpen(!open)} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
