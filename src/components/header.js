"use client";
import SearchBar from "@/components/search-bar";
import Logo from "@/components/logo";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import HeaderButton from "@/components/header-button";
import SideMenu from "@/components/side-menu";
import CompactLogin from "./compact-login";
import {FaHammer, FaUserCog, FaTimes, FaBars, FaUser} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Button from "./button";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const {data: session, status} = useSession();

    const [showMenu, setShowMenu] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (status !== "loading")
            setLoaded(true);
    }, [session])

    const GetHeaderElements = () => {
        return (
            <>
                {!session ?
                <div className="w-full flex justify-end">
                    <div className="hidden lg:block">
                        <CompactLogin onLoginSuccess={refreshSession} />
                    </div>
                    <Button color="blue" content="Log in"
                    style="block lg:hidden rounded-xs px-2 text-my-white" onClick={() => setShowMenu(true)} />
                </div>
                :
                <div className="flex justify-center gap-4 w-full">
                    <HeaderButton text={session.user?.name} icon={<FaUser />} href={`/user/${session.user?.name}`} />
                    <HeaderButton text="Build" icon={<FaHammer />} iconStyle={"-scale-x-[1]"} href="/build/new" />
                </div>
                }
            </>
        )
    }

    if (!loaded)
        return null;

    return (
        <>
            <header className="w-full fixed top-0 z-99">
                <div className="flex bg-background justify-between items-center h-12 px-4 gap-4">
                    <Logo isInHeader />
                    {session?.user?.role === "admin" && <HeaderButton text="Admin" icon={<FaUserCog />} href="/admin" />}
                    <div className="w-full h-full flex items-center justify-between gap-4">
                        <GetHeaderElements />
                    </div>
                    <button className="text-foreground text-3xl font-bold cursor-pointer hover:text-highlight transition-all" onClick={() => setShowMenu(!showMenu)}>
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                {!(pathname.includes("/build/")) &&
                <div className="flex items-center h-12 bg-background-1">
                    <div className="color-background w-full h-full flex justify-center items-center gap-2 py-2 px-4">
                        <SearchBar />
                    </div>
                </div>
                }
            </header>
            <SideMenu showMenu={showMenu} setShowMenu={setShowMenu} />
        </>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}