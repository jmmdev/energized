"use client";
import Button from "@/components/button";
import ThemeToggle from "./theme-toggle";
import SideMenuSection from "./side-menu-section";
import { doLogout } from "@/controllers/loginController";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import CompactLogin from "./compact-login";
import { getSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function SideMenu({showMenu, setShowMenu}) {

    const USER_SECTIONS = ["user search", "about", "privacy", "copyright"];

    const {data: session, status} = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const resizeTimer = useRef(null);
    const isResizing = useRef(false);

    useEffect(() => {
        const handleResize = () => {
            const sideMenuContainer = document.getElementById("side-menu-container");
            const sideMenu = document.getElementById("side-menu"); 

            if (!isResizing.current) {
                isResizing.current = true;
                sideMenu.classList.remove("transition-transform");
                sideMenuContainer.classList.remove("transition-all");
            }

            if (resizeTimer.current) {
                clearTimeout(resizeTimer.current);
            }

            resizeTimer.current = setTimeout(() => {
                isResizing.current = false;
                sideMenu.classList.add("transition-transform");
                sideMenuContainer.classList.add("transition-all");
            }, 500);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    const GetSections = () => {
        return (
            <div>
                {USER_SECTIONS.map((elem, index) => {
                    return (
                        <div key={elem} className={`w-full border-background-1 ${index < USER_SECTIONS.length - 1 && "border-b"}`}>
                            <SideMenuSection type="button" content={elem.toUpperCase()} />
                        </div>
                    )
                })}
                <SideMenuSection content={<ThemeToggle />} />
            </div>
        )
    }

    const handleLogout = async () => {
        await doLogout();
        const event = new Event("visibilitychange");
        document.dispatchEvent(event);
        router.push("/");
    }

    return (
        <aside id="side-menu-container" className={"w-dvw flex-auto fixed  left-0 transition-all " + 
            `${pathname.includes("/build") ? "h-[calc(100dvh_-_48px)] top-12" : "h-[calc(100dvh_-_96px)] top-24"} ${showMenu ? "bg-[#0008] z-90" : "-z-1"}`} 
        onClick={(e) => {
            e.preventDefault();
            setShowMenu(false);
        }}>
            <div className="relative w-full h-full">
                <div id="side-menu"
                className={"w-full md:w-2/5 xl:w-1/4 h-full flex flex-col gap-4 bg-background absolute top-0 left-full text-foreground p-4 transition-transform " +
                    `${showMenu && "-translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
                    {!session &&
                    <div className="w-full lg:hidden">
                        <CompactLogin onLoginSuccess={refreshSession} vertical />
                    </div>
                    }
                    <GetSections />
                    {session && session.user && <Button color={"gray"} content="LOG OUT" onClick={handleLogout} style="text-my-white py-1 w-full rounded" />}
                </div>
            </div>
        </aside>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}