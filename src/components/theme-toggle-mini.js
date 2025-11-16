"use client";
import { useTheme } from "@/context/theme-context";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggleMini() {

    const { theme, setTheme } = useTheme();

    const switchTheme = () => {
        if (theme === "light") {
            setTheme("dark");
            return;
        }
        setTheme("light");
    }

    return (
        <div className="flex gap-2 items-center">
            <FaSun className="text-xl" />
            <button className="group flex w-10 p-0.5 rounded-full border-2 border-foreground hover:border-highlight bg-background cursor-pointer" onClick={switchTheme}>
                <div className={`w-1/2 aspect-square bg-foreground rounded-full group-hover:bg-highlight transition-transform
                    ${theme === "light" ? "translate-x-0 group-active:translate-x-full" : "translate-x-full group-active:translate-x-0"}`} />
            </button>
            <FaMoon className="text-lg" />
        </div>
    )
}