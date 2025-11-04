// app/components/admin/AdminAssets.jsx
"use client";

import Script from "next/script";

export default function FrontendAssets() {
  return (
    <>
      {/* CSS files */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Exo:wght@400;500;600;700&family=Fira+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        crossOrigin="anonymous"
      />

      {/* Local CSS (store these inside /public/frontend_theme/css/) */}
      <link
        rel="stylesheet"
        href="/frontend_theme/assets/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="/frontend_theme/assets/css/fontawesome.min.css"
      />
      <link
        rel="stylesheet"
        href="/frontend_theme/assets/css/layerslider.min.css"
      />
      <link
        rel="stylesheet"
        href="/frontend_theme/assets/css/magnific-popup.min.css"
      />
      <link rel="stylesheet" href="/frontend_theme/assets/css/slick.min.css" />
      <link rel="stylesheet" href="/frontend_theme/assets/css/style.css" />

      {/* Add your other external CSS files here */}

      {/* JS files */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      {/* Add your other external JS files here */}
      {/* JS Files (use Next.js Script for performance) */}
      <Script
        src="/frontend_theme/assets/js/vendor/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
    
      <Script
        src="/frontend_theme/assets/js/bootstrap.min.js"
        strategy="afterInteractive"
      />
      
     
    </>
  );
}
