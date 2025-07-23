"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Logo() {

    const [logoSrc, setLogoSrc] = useState("");

    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newColorScheme = event.matches ? "dark" : "light";
            setLogoSrc(`/assets/images/logo-${newColorScheme}.png`);

        });

        let colorScheme = "light";
        if (window.matchMedia) {
            colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches && "dark";
        }

        setLogoSrc(`/assets/images/logo-${colorScheme}.png`);
    }, [])

    if (logoSrc.length > 0)
        return (
        <Link className="h-full" href="/" replace>
            <Image className="py-2 h-full w-auto object-contain" alt="energized logo" width={2000} height={2000} src={logoSrc} />
        </Link>
        );

    return null;
}