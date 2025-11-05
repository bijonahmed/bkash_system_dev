"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SwiperSlider from "../components/frontend/SwiperSlider";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect immediately when this component mounts
    router.push("/login");
  }, [router]);

  useEffect(() => {
    // Optional loading effect
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* You can add a loader or blank return */}
      {loading && <p className="text-center mt-10">Redirecting to login...</p>}
    </>
  );
}
