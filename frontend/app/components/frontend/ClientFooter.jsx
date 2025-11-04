// app/components/ClientNavbar.js
"use client"; // Must be top

import Link from "next/link";

export default function ClientFooter() {
  return (
    <footer
      className="footer-wrapper footer-layout1"
      data-bg-src="/frontend_theme/assets/img/shape/bg-footer-1-1.jpg"
    >
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-sm footer-info_group">
              <div className="footer-info">
                <div className="footer-info_icon">
                  <i className="fal fa-map-marker-alt" />
                </div>
                <div className="media-body">
                  <span className="footer-info_label">Office Address</span>
                  <div className="footer-info_link">
                   Road no: 78, House no-2, Gulsan-2, Dhaka, Bangladesh
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm footer-info_group">
              <div className="footer-info">
                <div className="footer-info_icon">
                  <i className="fal fa-clock" />
                </div>
                <div className="media-body">
                  <span className="footer-info_label">Working Hours</span>
                  <div className="footer-info_link">
                    Weekdays 8am - 22pm Weekend 10am - 12pm
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm footer-info_group">
              <div className="footer-info">
                <div className="footer-info_icon">
                  <i className="fal fa-phone-volume" />
                </div>
                <div className="media-body">
                  <span className="footer-info_label">Contact Us</span>
                  <div className="footer-info_link">
                    <a href="mailto:info@techbiz.com">info@futuregenit.com</a>
                    <br />
                    <a href="tel:+2597462153">+8801915728982</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="widget-area">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-md-6 col-lg-4 col-xl-auto">
              <div className="widget footer-widget">
                <h3 className="widget_title">About Us</h3>
                <div className="vs-widget-about">
                  <p className="footer-text">
                  Creative solutions real results FUTUREGENIT is a leading IT
                  service provider committed to delivering innovative and
                  customized technology solutions that drive business success.
                  </p>
                  <div className="footer-social">
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
            <div className="col-md-6 col-lg-2 col-xl-auto">
              <div className="widget widget_nav_menu  footer-widget">
                <h3 className="widget_title">Links</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu">
                    <li>
                      <a href="#">About Us</a>
                    </li>
                    <li>
                      <a href="#">Our Mission</a>
                    </li>
                    <li>
                      <a href="#">Meet The Teams</a>
                    </li>
                    <li>
                      <a href="#">Our Projects</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-2 col-xl-auto">
              <div className="widget widget_nav_menu  footer-widget">
                <h3 className="widget_title">Explore</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu">
                    <li>
                      <a href="#">What we Offer</a>
                    </li>
                    <li>
                      <a href="#">Our Story</a>
                    </li>
                    <li>
                      <a href="#">Latest Posts</a>
                    </li>
                    <li>
                      <a href="#">Help Center</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-wrap">
        <div className="container">
          <p className="copyright-text">
            Copyright <i className="fal fa-copyright" /> 2025{" "}
            <Link className="text-white" href="/">
              Futuregenit
            </Link>
            . All rights reserved by{" "}
            <a
              className="text-white"
              href="https://futuregenit.com/" target="_blank"
            >
              Futuregenit
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
