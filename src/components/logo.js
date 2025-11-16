"use client";

import Image from "next/image";
import { useTheme } from "@/context/theme-context";
import Link from "next/link";
import ConfirmingLink from "./confirming-link";

export default function Logo({isInHeader, needsConfirm}) {
    const {theme, setTheme} = useTheme();

    const GetContent = () => {
        if (isInHeader)
            return (
                <>
                    <Image className="sm:hidden h-full w-max object-contain" alt="energized logo" priority width={2000} height={2000} src={`/assets/images/compact-logo-${theme}.png`} />
                    <Image className="hidden sm:block py-2 h-full w-auto object-contain" priority alt="energized logo" width={2000} height={2000} src={`/assets/images/logo-${theme}.png`} />
                </>
            )
        return <Image className="py-1 h-full w-auto object-contain" alt="energized logo" priority width={2000} height={2000} src={`/assets/images/logo-${theme}.png`} />
    }

    if (needsConfirm)
        return (
            <ConfirmingLink className="h-full" href="/">
                <GetContent />
            </ConfirmingLink>
        )
    return (
        <Link className="h-full" href="/">
            <GetContent />
        </Link>
    )
}