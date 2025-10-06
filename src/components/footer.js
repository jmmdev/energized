"use client";
import Logo from "@/components/logo";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer(){
    const {data: session, status} = useSession();

    const [loaded, setLoaded] = useState(false);

    const FOOTER_SECTIONS = [
        {text: "about", route: "https://devjosm.vercel.app"}, 
        {text: "privacy", route: "/privacy"}, 
        {text: "copyright", route: "/copyright"},
        {text: "terms of use", route: "/terms-of-use"},
    ];
    
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
        <footer className="relative w-full z-80">
            <div className="relative w-full flex flex-col justify-center items-center gap-2 border-t-1 border-background-2 py-8">
                <div className="h-10">
                    <Logo />
                </div>
                <div className="flex gap-4">
                    {
                        FOOTER_SECTIONS.map(elem => <Link className="capitalize" key={elem.text} href={elem.route} target="_blank">{elem.text}</Link>)
                    }
                </div>
            </div>
        </footer>
    )
}