"use client";
import Logo from "@/components/logo";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Footer(){
    const {data: session, status} = useSession();

    const [loaded, setLoaded] = useState(false);
    
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

    useEffect(() => {
        if (status !== "loading")
            setLoaded(true);
    }, [session])
    
    if (!loaded)
        return null;

    return (
        <footer className="relative w-full z-80 py-8">
            <div className="relative w-full flex flex-col justify-center items-center gap-2 border-t-1 border-background-2 pt-8">
                <div className="h-10">
                    <Logo />
                </div>
                <div className="flex gap-4">
                    <a href="https://devjosm.vercel.app" target="_blank">About</a>
                    <a href="/" target="_blank">Privacy</a>
                    <a href="/" target="_blank">Copyright</a>
                </div>
            </div>
        </footer>
    )
}