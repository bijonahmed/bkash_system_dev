"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";

export default function SwiperSlider() {
  const [sliderHeight, setSliderHeight] = useState(700); // default desktop height

  // Dynamically adjust height based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSliderHeight(300); // mobile height
      } else if (window.innerWidth < 1024) {
        setSliderHeight(500); // tablet height
      } else {
        setSliderHeight(700); // desktop height
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slides = [
    "/frontend_theme/assets/img/hero/hero-4-2.jpg",
    "/frontend_theme/assets/img/hero/hero-4-3.jpg",
    "/frontend_theme/assets/img/hero/hero-5-1.jpg",
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      loop
      className="rounded-2xl shadow-lg"
    >
      {slides.map((imgSrc, index) => (
        <SwiperSlide key={index}>
          <div
            style={{
              width: "100%",
              height: `${sliderHeight}px`,
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <img
              src={imgSrc}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: window.innerWidth < 768 ? "18px" : "36px",
                fontWeight: "bold",
                textAlign: "center",
                padding: "0 10px",
              }}
            >
              Welcome to FuturegenIT
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
