"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/theme-context";

export default function Logo() {

    const {theme, setTheme} = useTheme();

    return (
        <Link className="h-full" href="/" replace>
            <Image className="py-2 h-full w-auto object-contain" alt="energized logo" width={2000} height={2000} src={`/assets/images/logo-${theme}.png`} />
        </Link>
    );
}