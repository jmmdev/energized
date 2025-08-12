"use client";
import SearchBar from "@/components/search-bar";
import Logo from "@/components/logo";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import HeaderButton from "@/components/header-button";
import SideMenu from "@/components/side-menu";
import CompactLogin from "./compact-login";
import {FaHammer, FaUserCog, FaTimes, FaBars, FaUser, FaStar} from "react-icons/fa";
import {TbCardsFilled} from "react-icons/tb"
import { useRouter } from "next/navigation";
import Button from "./button";

export default function Header() {
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
                    <Button color="blue" content="Log in" style="block lg:hidden" onClick={() => setShowMenu(true)} />
                </div>
                :
                <div className="flex justify-center gap-4 w-full">
                    <HeaderButton text={session.user?.name} icon={<FaUser />} handler={() => {}} />
                    <HeaderButton text="my decks" icon={<TbCardsFilled />} handler={() => {}} />
                    <HeaderButton text="favorites" icon={<FaStar />} handler={() => {}} />
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
                    {session?.user?.role === "admin" && <HeaderButton text="Admin" icon={<FaUserCog />} handler={() => router.push("/admin")} />}
                    <div className="w-full h-full flex items-center justify-between gap-4">
                        <GetHeaderElements />
                    </div>
                    <HeaderButton text="Build" icon={<FaHammer />} iconStyle={"-scale-x-[1]"} handler={() => router.push("/build/new")} />
                    <button className="text-foreground text-3xl font-bold cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <div className="flex items-center h-12 bg-container">
                    <div className="color-background w-full h-full flex justify-center items-center gap-2 py-2 px-4">
                        <SearchBar />
                    </div>
                </div>
            </header>
            <SideMenu showMenu={showMenu} setShowMenu={setShowMenu} />
        </>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}