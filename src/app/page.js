"use client";
import { useEffect } from "react";
import Hero from "../components/hero";

export default function Home() {

  useEffect(() => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }, [])

  return (
    <Hero />
  );
}