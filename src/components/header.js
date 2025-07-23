"use client";
import SearchBar from "@/components/search-bar";
import Logo from "@/components/logo";
import { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import HeaderButton from "@/components/header-button";
import SideMenu from "@/components/side-menu";
import HeaderLogin from "./header-login";
import {FaHammer, FaUserCog, FaTimes, FaBars} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const {data: session, status} = useSession();

    const [showMenu, setShowMenu] = useState(false);

    const GetHeaderElements = () => {
        if (status === "loading")
            return null

        return (
            <>
                {session?.user?.role === "admin" ? <HeaderButton text="Admin" icon={<FaUserCog />} handler={() => router.push("/admin")} /> : <div />}
                {!session && <HeaderLogin onLoginSuccess={refreshSession} />}
                {session && <HeaderButton text="Build" icon={<FaHammer />} iconStyle={"-scale-x-[1]"} handler={() => router.push("/build")} />}
            </>
        )
    }

    return (
        <>
            <header className="w-full fixed top-0 z-99">
                <div className="flex bg-background justify-between items-center h-12 px-4 gap-4">
                    <Logo />
                    <div className="w-full h-full flex justify-between gap-4">
                        <GetHeaderElements />
                    </div>
                    <button className="text-foreground text-3xl font-bold cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <div className="flex items-center h-12 bg-container">
                    <form onSubmit={e => {
                        e.preventDefault();
                    }} className="color-background w-full h-full flex justify-center items-center gap-2 py-2 px-4">
                        <SearchBar />
                    </form>
                </div>
            </header>
            <SideMenu showMenu={showMenu} setShowMenu={setShowMenu} userId={session?.user?.id} userName={session?.user?.username || session?.user?.name}/>
        </>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}