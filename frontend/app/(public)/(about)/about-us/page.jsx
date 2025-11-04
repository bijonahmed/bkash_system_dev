import Link from "next/link";

export const metadata = {
  title: "About Us - My Website",
  description: "Learn more about our company, mission, and values.",
  keywords: ["about us", "company info", "our team"],
  openGraph: {
    title: "About Us - My Website",
    description: "Learn more about our company, mission, and values.",
    url: "https://mywebsite.com/about",
    siteName: "My Website",
    images: [
      {
        url: "/og-image-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Us Preview",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://mywebsite.com/about",
  },
};

export default function AboutPage() {
  return (
    <div>
      <div
        className="breadcumb-wrapper "
        style={{
          backgroundImage: `url('/frontend_theme/assets/img/bg/appoin-bg-1-1.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "200px", // adjust as needed
        }}
      >
        <div className="container z-index-common">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">About Us</h1>
            <div className="breadcumb-menu-wrap">
              <ul className="breadcumb-menu">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>About Us</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/*==============================
    Service Area
    ==============================*/}
      <section className=" space-top space-extra-bottom">
        <div className="container   wow fadeInUp" data-wow-delay="0.2s">
          <div
            className="row vs-carousel"
            data-slide-show={3}
            data-md-slide-show={2}
          >
            <div className="col-md-6 col-lg-4">
              <div className="service-style1 layout3">
                <div
                  className="service-bg"
                  data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                />
                <div className="service-top">
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-1.png"
                      alt="Features"
                    />
                  </div>
                  <span className="service-number">01</span>
                </div>
                <h3 className="service-title h5">
                  <a href="#">Cloud Services</a>
                </h3>
                <p className="service-text">
                  Cardinate premier technology without sustainable leadership
                  work...
                </p>
                <a href="#" className="link-btn">
                  Read More
                  <i className="far fa-long-arrow-right" />
                </a>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="service-style1 layout3">
                <div
                  className="service-bg"
                  data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                />
                <div className="service-top">
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-2.png"
                      alt="Features"
                    />
                  </div>
                  <span className="service-number">02</span>
                </div>
                <h3 className="service-title h5">
                  <a href="#">Software Services</a>
                </h3>
                <p className="service-text">
                  Cardinate premier technology without sustainable leadership
                  work...
                </p>
                <a href="#" className="link-btn">
                  Read More
                  <i className="far fa-long-arrow-right" />
                </a>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="service-style1 layout3">
                <div
                  className="service-bg"
                  data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                />
                <div className="service-top">
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-3.png"
                      alt="Features"
                    />
                  </div>
                  <span className="service-number">03</span>
                </div>
                <h3 className="service-title h5">
                  <a href="#">Machine Learning</a>
                </h3>
                <p className="service-text">
                  Cardinate premier technology without sustainable leadership
                  work...
                </p>
                <a href="#" className="link-btn">
                  Read More
                  <i className="far fa-long-arrow-right" />
                </a>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="service-style1 layout3">
                <div
                  className="service-bg"
                  data-bg-src="/frontend_theme/assets/img/bg/sr-box-bg-1.jpg"
                />
                <div className="service-top">
                  <div className="service-icon">
                    <img
                      src="/frontend_theme/assets/img/icon/sr-icon-1-4.png"
                      alt="Features"
                    />
                  </div>
                  <span className="service-number">04</span>
                </div>
                <h3 className="service-title h5">
                  <a href="#">Business Analycis</a>
                </h3>
                <p className="service-text">
                  Cardinate premier technology without sustainable leadership
                  work...
                </p>
                <a href="#" className="link-btn">
                  Read More
                  <i className="far fa-long-arrow-right" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
