"use client";
import Button from "@/components/button";
import ThemeToggle from "./theme-toggle";
import SideMenuSection from "./side-menu-section";
import { doLogout } from "@/controllers/loginController";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "@/context/theme-context";

export default function SideMenu({showMenu, setShowMenu}) {

    const USER_SECTIONS = ["user search", "about", "privacy", "copyright"];
    const { theme, setTheme } = useTheme();

    const {data: session, status} = useSession();
    const router = useRouter();

    const GetUserSections = () => {
        if (session?.user) {
            return (
                <div>
                    {USER_SECTIONS.map((elem, index) => {
                        return (
                            <div key={elem} className={`w-full border-container ${index < USER_SECTIONS.length - 1 && "border-b"}`}>
                                <SideMenuSection type="button" content={elem.toUpperCase()} />
                            </div>
                        )
                    })}
                   <SideMenuSection content={<ThemeToggle />} />
                </div>
            )
        }
        return null;
    }

    const handleLogout = async () => {
        await doLogout();
        router.push("/");
    }

    return (
        <aside className={`w-screen h-screen fixed top-0 left-0 pt-24 ${showMenu ? "bg-[#0008] z-90" : "z-0"}`}
        onClick={(e) => {
            e.preventDefault();
            setShowMenu(false);
        }}>
            <div className="relative w-full h-full">
                <div className={`w-full md:w-2/5 xl:w-1/4 h-full flex flex-col gap-4 bg-background absolute top-0 left-full text-foreground p-4 ${showMenu && "-translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
                    {session?.user &&
                        <div className="flex h-6 justify-end">
                            <div className="w-6 h-full flex justify-center items-center rounded-full p-1 border-2 border-foreground">
                                <div className="relative w-full h-full">
                                    <Image alt="User type" fill src={`/assets/images/user-${theme}.png`} />
                                </div>
                            </div>
                            <div className="flex items-end h-full"> 
                                <p className="px-2">{session.user.name}</p>
                            </div>
                        </div>
                    }
                        <GetUserSections />
                    {session && session.user && <Button color={"gray"} content="LOG OUT" onClick={handleLogout} style="w-full" />}
                </div>
            </div>
        </aside>
    )
}