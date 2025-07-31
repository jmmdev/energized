"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/context/theme-context";

export default function Logo({isInHeader}) {

    const {theme, setTheme} = useTheme();

    return (
        <Link className="h-full" href="/" replace>
            {isInHeader ?
            <>
                <Image className="sm:hidden h-full w-max object-contain" alt="energized logo" width={2000} height={2000} src={`/assets/images/compact-logo-${theme}.png`} />
                <Image className="hidden sm:block py-1.5 md:py-2 h-full w-auto object-contain" alt="energized logo" width={2000} height={2000} src={`/assets/images/logo-${theme}.png`} />
            </>
            :
                <Image className="py-1 h-full w-auto object-contain" alt="energized logo" width={2000} height={2000} src={`/assets/images/logo-${theme}.png`} />
            }
        </Link>
    );
}