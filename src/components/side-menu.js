"use client";
import Button from "@/components/button";
import SideMenuButton from "./side-menu-button";
import { doLogout } from "@/controllers/loginController";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SideMenu({showMenu, setShowMenu}) {

    const USER_SECTIONS = ["my decks", "favorites"];

    const {data: session, status} = useSession();
    const router = useRouter();

     const [userSrc, setUserSrc] = useState("");
    
    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newColorScheme = event.matches ? "dark" : "light";
            setUserSrc(`/assets/images/user-${newColorScheme}.png`);

        });

        let colorScheme;
        if (window.matchMedia) {
            colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
        }

        setUserSrc(`/assets/images/user-${colorScheme}.png`);
    }, [])

    const GetUserSections = () => {
        const output = [];
        if (session?.user) {
            USER_SECTIONS.map((elem, index) => {
                output.push (
                    <div key={elem} className={`w-full border-container ${index < USER_SECTIONS.length - 1 && "border-b"}`}>
                        <SideMenuButton content={elem.toUpperCase()} />
                    </div>
                )
            })
        }
        return output;
    }

    const handleLogout = async () => {
        await doLogout();
        router.push("/");
    }

    return (
        <aside className={`w-screen h-screen fixed top-0 left-0 pt-24 transition-all ${showMenu ? "bg-[#0008] z-90" : "z-0"}`}
        onClick={(e) => {
            e.preventDefault();
            setShowMenu(false);
        }}>
            <div className="relative w-full h-full">
                <div className={`w-full md:w-2/5 xl:w-1/4 h-full flex flex-col gap-4 bg-background absolute top-0 left-full text-foreground p-4 transition-all ${showMenu && "-translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
                    {session?.user &&
                        <div className="flex h-6 justify-end">
                            <div className="w-6 h-full flex justify-center items-center rounded-full p-1 border-2 border-foreground">
                                <div className="relative w-full h-full">
                                    {userSrc && <Image alt="User type" fill src={userSrc} />}
                                </div>
                            </div>
                            <div className="flex items-end h-full"> 
                                <p className="px-2">{session.user.name}</p>
                            </div>
                        </div>
                    }
                    <div>
                        <GetUserSections />
                    </div>
                    {session && session.user && <Button color={"gray"} content="LOG OUT" onClick={handleLogout} style="w-full" />}
                </div>
            </div>
        </aside>
    )
}