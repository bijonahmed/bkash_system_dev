"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export const useIdleLogout = (timeout = 300000) => { // 5 min
  const router = useRouter();
  const timer = useRef();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(logout, timeout);
  };

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach(event => window.addEventListener(event, resetTimer));

    // Clear token when tab/browser closes
    const handleUnload = () => localStorage.removeItem("token");
    window.addEventListener("beforeunload", handleUnload);

    resetTimer(); // start timer initially

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [timeout]);
};
