import Button from "@/components/button";
import SideMenuButton from "./side-menu-button";
import { doLogout } from "@/controllers/loginController";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function SideMenu({showMenu, setShowMenu}) {
    const {data: session, status} = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const GENERAL_SECTIONS = ["language", "theme"];
    const USER_SECTIONS = ["my decks", "favorites"]

    const GetUserSections = () => {
        const output = [];
        if (session?.user) {
            USER_SECTIONS.map((elem, index) => {
                output.push (
                    <div key={elem} className={`w-full border-foreground border-b`}>
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
                <div className={`w-full max-w-[500px] h-full flex flex-col gap-4 bg-background absolute top-0 left-full text-foreground p-4 transition-all ${showMenu && "-translate-x-full"}`} onClick={(e) => e.stopPropagation()}>
                    {session?.user && <p className="px-2">Hi {session?.user?.username || session?.user?.name}</p>}
                    <div>
                        <GetUserSections />
                        {
                            GENERAL_SECTIONS.map((elem, index) => {
                                return (
                                    <div key={elem} className={`w-full border-foreground ${index !== GENERAL_SECTIONS.length -1 && "border-b"}`}>
                                        <SideMenuButton content={elem.toUpperCase()} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    {session && session.user && <Button color={"gray"} content="LOG OUT" onClick={handleLogout} style="w-full" />}
                </div>
            </div>
        </aside>
    )
}