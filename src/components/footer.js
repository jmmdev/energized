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
        <footer className="relative w-full flex md:flex-col justify-center items-center gap-8 md:gap-4 p-8 z-80">
            <div className="h-10">
                <Logo />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                <a href="https://devjosm.vercel.app" target="_blank">About</a>
                <a href="/" target="_blank">Privacy Policy</a>
                <a href="/" target="_blank">Copyright Disclaimer</a>
            </div>
        </footer>
    )
}