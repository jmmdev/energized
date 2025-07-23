"use client";
import Logo from "@/components/logo";
import { useEffect } from "react";

export default function Footer(){
    
    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newColorScheme = event.matches ? "dark" : "light";
            window.localStorage.setItem("theme", newColorScheme);
        });

        if (window.matchMedia) {
            window.localStorage.setItem(
                "theme",
                window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"
            );
        }
    }, [])
    
    return (
        <footer className="relative w-full flex flex-col justify-center items-center gap-4 p-8 z-80">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <a href="/" target="_blank">Copyright Disclaimer</a>
                <a href="/" target="_blank">Privacy Policy</a>
                <a href="https://devjosm.vercel.app" target="_blank">About</a>
            </div>
            <div className="h-10">
                <Logo />
            </div>
        </footer>
    )
}