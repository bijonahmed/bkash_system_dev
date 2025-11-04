"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import SwiperSlider from "../components/frontend/SwiperSlider";
import "./loader.css"; // 👈 we'll create this file next

export default function Home() {
  const imageSrc = "/logo.jpg";
  const [loading, setLoading] = useState(true);
   useEffect(() => {
    // Wait for Swiper or assets to load — simulate or use actual image load
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div>
    <section className="vs-hero-wrapper position-relative" style={{ minHeight: 180 }}>
      {/* Spinner overlay (Bootstrap) */}
      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
          style={{
            background: "rgba(255,255,255,0.9)",
            zIndex: 9999,
          }}
        >
          {/* Bootstrap spinner */}
          <div className="spinner-border" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>

          {/* Optional text */}
          <div style={{ marginTop: 12 }}>
            <small className="text-muted">Loading content…</small>
          </div>
        </div>
      )}

      {/* Slider (kept in DOM even while loading so we can detect images) */}
      <div style={{ opacity: loading ? 0.25 : 1, transition: "opacity .5s ease" }}>
        <SwiperSlider />
      </div>
    </section>
        <div data-bg-src="/frontend_theme/assets/img/bg/ab-bg-1-1.jpg">
          {/*==============================
    Features Area
    ==============================*/}
          <section className="feature-wrap1  space-top space-extra-bottom">
            <div className="container wow fadeInUp" data-wow-delay="0.2s">
              <div
                className="row vs-carousel"
                data-slide-show={3}
                data-lg-slide-show={2}
                data-md-slide-show={2}
              >
                <div className="col-xl-4">
                  <div className="feature-style1">
                    <div className="feature-icon">
                      <img
                        src="/frontend_theme/assets/img/icon/fe-1-1.png"
                        alt="Features"
                      />
                    </div>
                    <h3 className="feature-title h5">
                      <a className="text-inherit" href="#">
                        Development Services
                      </a>
                    </h3>
                    <p className="feature-text">
                      Completely implement via highly efficient process
                      improvements. engage high value before progressive data.
                    </p>
                    <a href="#" className="vs-btn style3">
                      Read More
                      <i className="far fa-long-arrow-right" />
                    </a>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="feature-style1">
                    <div className="feature-icon">
                      <img
                        src="/frontend_theme/assets/img/icon/fe-1-2.png"
                        alt="Features"
                      />
                    </div>
                    <h3 className="feature-title h5">
                      <a className="text-inherit" href="#">
                        Marketing Services
                      </a>
                    </h3>
                    <p className="feature-text">
                      Completely implement via highly efficient process
                      improvements. engage high value before progressive data.
                    </p>
                    <a href="#" className="vs-btn style3">
                      Read More
                      <i className="far fa-long-arrow-right" />
                    </a>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="feature-style1">
                    <div className="feature-icon">
                      <img
                        src="/frontend_theme/assets/img/icon/fe-1-3.png"
                        alt="Features"
                      />
                    </div>
                    <h3 className="feature-title h5">
                      <a className="text-inherit" href="#">
                        Consulting Services
                      </a>
                    </h3>
                    <p className="feature-text">
                      Completely implement via highly efficient process
                      improvements. engage high value before progressive data.
                    </p>
                    <a href="#" className="vs-btn style3">
                      Read More
                      <i className="far fa-long-arrow-right" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/*==============================
    About Us
    ==============================*/}
          <section className="position-relative space-bottom">
            <span className="about-shape1 d-none d-xl-block">TechBiz</span>
            <div className="container z-index-common">
              <div className="row gx-60">
                <div
                  className="col-lg-6 col-xl-5 mb-50 mb-lg-0 wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <div className="img-box1">
                    <div className="img-1">
                      <img
                        src="/frontend_theme/assets/img/about/ab-1-1.jpg"
                        alt="About image"
                      />
                    </div>
                    <div className="img-2">
                      <img
                        src="/frontend_theme/assets/img/about/ab-1-2.jpg"
                        alt="About image"
                      />
                      <a
                        className="play-btn style2 position-center popup-video"
                        href="https://www.youtube.com/watch?v=_sI_Ps7JSEk"
                      ></a>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-6 col-xl-7 align-self-center wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  <span className="sec-subtitle">
                    <i className="fas fa-bring-forward" />
                    Get best It solution 2022
                  </span>
                  <h2 className="sec-title h1">
                    Trust Our Best IT Solution For Your Business
                  </h2>
                  <p className="mb-4 mt-1 pb-3">
                    Compellingly mesh cross-platform portals through functional
                    human capital world-class architectures for orthogonal
                    initiatives. Assertively benchmark visionary quality vectors
                    after covalent e-tailers. Intrinsicly enhance 24/7 users and
                    supply process
                  </p>
                  <div className="call-media">
                    <div className="call-media__icon">
                      <img
                        src="/frontend_theme/assets/img/icon/tel-1-1.png"
                        alt="icon"
                      />
                    </div>
                    <div className="media-body">
                      <span className="call-media__label">
                        24 HOURS SERVICE AVAILABLE
                      </span>
                      <p className="call-media__info">
                        Call Us: <a href="tel:+6668880000">+(666) 888 0000</a>
                      </p>
                    </div>
                  </div>
                  <a href="about.html" className="vs-btn">
                    About Us
                    <i className="far fa-long-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/*==============================
    Service Area
    ==============================*/}
        <section
          className=" space-top space-extra-bottom"
          data-bg-src="/frontend_theme/assets/img/bg/sr-bg-1-1.png"
        >
          <div className="container">
            <div className="row justify-content-center text-center">
              <div
                className="col-lg-8 col-xl-6 wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <div className="title-area">
                  <span className="sec-subtitle">Our Latest Services</span>
                  <h2 className="sec-title h1">
                    What Kind of Services We are Offering
                  </h2>
                </div>
              </div>
            </div>
            <div className="row wow fadeInUp" data-wow-delay="0.2s">
              <div className="col-md-6 col-lg-4">
                <div className="service-style1">
                  <div
                    className="service-bg"
                    data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                  />
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-1.png"
                      alt="Features"
                    />
                  </div>
                  <h3 className="service-title h5">
                    <a href="#">Cloud Services</a>
                  </h3>
                  <p className="service-text">
                    Deliver plug commerce with dynamic is expertise. leading
                    edge products with business models
                  </p>
                  <a href="#" className="vs-btn style3">
                    Read More
                    <i className="far fa-long-arrow-right" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="service-style1">
                  <div
                    className="service-bg"
                    data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                  />
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-2.png"
                      alt="Features"
                    />
                  </div>
                  <h3 className="service-title h5">
                    <a href="#">Web Development</a>
                  </h3>
                  <p className="service-text">
                    Deliver plug commerce with dynamic is expertise. leading
                    edge products with business models
                  </p>
                  <a href="#" className="vs-btn style3">
                    Read More
                    <i className="far fa-long-arrow-right" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="service-style1">
                  <div
                    className="service-bg"
                    data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                  />
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-3.png"
                      alt="Features"
                    />
                  </div>
                  <h3 className="service-title h5">
                    <a href="#">IT Management</a>
                  </h3>
                  <p className="service-text">
                    Deliver plug commerce with dynamic is expertise. leading
                    edge products with business models
                  </p>
                  <a href="#" className="vs-btn style3">
                    Read More
                    <i className="far fa-long-arrow-right" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="service-style1">
                  <div
                    className="service-bg"
                    data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                  />
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-4.png"
                      alt="Features"
                    />
                  </div>
                  <h3 className="service-title h5">
                    <a href="#">Software Services</a>
                  </h3>
                  <p className="service-text">
                    Deliver plug commerce with dynamic is expertise. leading
                    edge products with business models
                  </p>
                  <a href="#" className="vs-btn style3">
                    Read More
                    <i className="far fa-long-arrow-right" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="service-style1">
                  <div
                    className="service-bg"
                    data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                  />
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-5.png"
                      alt="Features"
                    />
                  </div>
                  <h3 className="service-title h5">
                    <a href="#">Machine Learning</a>
                  </h3>
                  <p className="service-text">
                    Deliver plug commerce with dynamic is expertise. leading
                    edge products with business models
                  </p>
                  <a href="#" className="vs-btn style3">
                    Read More
                    <i className="far fa-long-arrow-right" />
                  </a>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="service-style1">
                  <div
                    className="service-bg"
                    data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                  />
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-6.png"
                      alt="Features"
                    />
                  </div>
                  <h3 className="service-title h5">
                    <a href="#">Business Analycis</a>
                  </h3>
                  <p className="service-text">
                    Deliver plug commerce with dynamic is expertise. leading
                    edge products with business models
                  </p>
                  <a href="#" className="vs-btn style3">
                    Read More
                    <i className="far fa-long-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className=" space-top space-extra-bottom">
          <div className="container wow fadeInUp" data-wow-delay="0.2s">
            <div className="row justify-content-center text-center">
              <div className="col-xl-6">
                <div className="title-area">
                  <span className="sec-subtitle">Great Team Members</span>
                  <h2 className="sec-title h1">We Have Expert Team</h2>
                </div>
              </div>
            </div>
            <div
              className="row vs-carousel"
              data-slide-show={4}
              data-lg-slide-show={3}
              data-md-slide-show={2}
            >
              <div className="col-xl-3">
                <div className="team-style1">
                  <div className="team-img">
                    <a href="team-details.html">
                      <img
                        src="/frontend_theme/assets/img/team/t-1-1.jpg"
                        alt="image"
                      />
                    </a>
                    <div className="team-social">
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
                  <div className="team-content">
                    <h3 className="team-title">
                      <a className="text-inherit" href="team-details.html">
                        Daniel Matthew
                      </a>
                    </h3>
                    <p className="team-degi">Cheif Expert</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3">
                <div className="team-style1">
                  <div className="team-img">
                    <a href="team-details.html">
                      <img
                        src="/frontend_theme/assets/img/team/t-1-2.jpg"
                        alt="image"
                      />
                    </a>
                    <div className="team-social">
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
                  <div className="team-content">
                    <h3 className="team-title">
                      <a className="text-inherit" href="team-details.html">
                        Grayson Gabriel
                      </a>
                    </h3>
                    <p className="team-degi">Head Manager</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3">
                <div className="team-style1">
                  <div className="team-img">
                    <a href="team-details.html">
                      <img
                        src="/frontend_theme/assets/img/team/t-1-3.jpg"
                        alt="image"
                      />
                    </a>
                    <div className="team-social">
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
                  <div className="team-content">
                    <h3 className="team-title">
                      <a className="text-inherit" href="team-details.html">
                        Alexander Mason
                      </a>
                    </h3>
                    <p className="team-degi">Founder &amp; CEO</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3">
                <div className="team-style1">
                  <div className="team-img">
                    <a href="team-details.html">
                      <img
                        src="/frontend_theme/assets/img/team/t-1-4.jpg"
                        alt="image"
                      />
                    </a>
                    <div className="team-social">
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
                  <div className="team-content">
                    <h3 className="team-title">
                      <a className="text-inherit" href="team-details.html">
                        Maverick Cameron
                      </a>
                    </h3>
                    <p className="team-degi">Pro Developer</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3">
                <div className="team-style1">
                  <div className="team-img">
                    <a href="team-details.html">
                      <img
                        src="/frontend_theme/assets/img/team/t-1-5.jpg"
                        alt="image"
                      />
                    </a>
                    <div className="team-social">
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
                  <div className="team-content">
                    <h3 className="team-title">
                      <a className="text-inherit" href="team-details.html">
                        Marian Widjya
                      </a>
                    </h3>
                    <p className="team-degi">Lead Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className=" space-top space-extra-bottom">
          <div className="container">
            <div className="row flex-row-reverse">
              <div
                className="col-lg-5 col-xxl-auto mb-30 pb-20 pb-lg-0 wow fadeInUp"
                data-wow-delay="0.2s"
              >
                <img
                  src="/frontend_theme/assets/img/skill/skill-1-1.jpg"
                  alt="Skill image"
                />
              </div>
              <div className="col-lg-7 col-xxl-6 me-xl-auto">
                <span className="sec-subtitle">
                  <i className="fas fa-bring-forward" />
                  The Great Company Skill
                </span>
                <h2 className="sec-title h1">
                  Connecting People And Build Technology
                </h2>
                <p className="mb-4 pb-1">
                  Energistically evisculate an expanded array of meta-services
                  after cross-media strategic theme areas. Interactively
                  simplify interactive customer service before fully tested
                  relationship parallel task high standards...
                </p>
                <div className="progress-box">
                  <h3 className="progress-box__title">Business Security</h3>
                  <span className="progress-box__number">65%</span>
                  <div className="progress-box__progress">
                    <div
                      className="progress-box__bar"
                      role="progressbar"
                      style={{ width: "65%" }}
                      aria-valuenow={65}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
                <div className="progress-box">
                  <h3 className="progress-box__title">Career Development</h3>
                  <span className="progress-box__number">88%</span>
                  <div className="progress-box__progress">
                    <div
                      className="progress-box__bar"
                      role="progressbar"
                      style={{ width: "88%" }}
                      aria-valuenow={88}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
                <div className="progress-box">
                  <h3 className="progress-box__title">Business Inovation</h3>
                  <span className="progress-box__number">90%</span>
                  <div className="progress-box__progress">
                    <div
                      className="progress-box__bar"
                      role="progressbar"
                      style={{ width: "90%" }}
                      aria-valuenow={90}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        <section
          className=" space-top space-extra-bottom"
          data-bg-src="/frontend_theme/assets/img/bg/process-bg-1-1.jpg"
          id="processv1"
        >
          <div className="container wow fadeInUp" data-wow-delay="0.2s">
            <div className="row justify-content-center text-center">
              <div className="col-xl-6">
                <div className="title-area">
                  <span className="sec-subtitle">Great Team Members</span>
                  <h2 className="sec-title h1">We Have Expert Team</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-3 process-style1">
                <div className="process-arrow">
                  <img
                    src="/frontend_theme/assets/img/icon/process-arrow-1-1.png"
                    alt="arrow"
                  />
                </div>
                <div className="process-icon">
                  <img
                    src="/frontend_theme/assets/img/icon/process-1-4.png"
                    alt="icon"
                  />
                  <span className="process-number">01</span>
                </div>
                <h3 className="process-title h5">Medicine Help</h3>
                <p className="process-text">
                  Extensible for web iterate process before meta services impact
                  with olisticly enable client.
                </p>
              </div>
              <div className="col-sm-6 col-lg-3 process-style1">
                <div className="process-arrow">
                  <img
                    src="/frontend_theme/assets/img/icon/process-arrow-1-1.png"
                    alt="arrow"
                  />
                </div>
                <div className="process-icon">
                  <img
                    src="/frontend_theme/assets/img/icon/process-1-1.png"
                    alt="icon"
                  />
                  <span className="process-number">01</span>
                </div>
                <h3 className="process-title h5">We Build and Create</h3>
                <p className="process-text">
                  Extensible for web iterate process before meta services impact
                  with olisticly enable client.
                </p>
              </div>
              <div className="col-sm-6 col-lg-3 process-style1">
                <div className="process-arrow">
                  <img
                    src="/frontend_theme/assets/img/icon/process-arrow-1-1.png"
                    alt="arrow"
                  />
                </div>
                <div className="process-icon">
                  <img
                    src="/frontend_theme/assets/img/icon/process-1-2.png"
                    alt="icon"
                  />
                  <span className="process-number">01</span>
                </div>
                <h3 className="process-title h5">Water Delivery</h3>
                <p className="process-text">
                  Extensible for web iterate process before meta services impact
                  with olisticly enable client.
                </p>
              </div>
              <div className="col-sm-6 col-lg-3 process-style1">
                <div className="process-arrow">
                  <img
                    src="/frontend_theme/assets/img/icon/process-arrow-1-1.png"
                    alt="arrow"
                  />
                </div>
                <div className="process-icon">
                  <img
                    src="/frontend_theme/assets/img/icon/process-1-3.png"
                    alt="icon"
                  />
                  <span className="process-number">01</span>
                </div>
                <h3 className="process-title h5">We Care About</h3>
                <p className="process-text">
                  Extensible for web iterate process before meta services impact
                  with olisticly enable client.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
