"use client";
import { useTheme } from "@/context/theme-context";

export default function ThemeToggle() {

    const { theme, setTheme } = useTheme();

    const switchTheme = () => {
        if (theme === "light") {
            setTheme("dark");
            return;
        }
        setTheme("light");
    }

    return (
        <div className="flex gap-4 items-center">
            <div className="flex gap-2 items-center">
                <p className="uppercase">
                    theme
                </p>
                <button className="group flex w-10 p-0.5 rounded-full border-2 border-foreground hover:border-highlight-hover bg-background cursor-pointer" onClick={switchTheme}>
                    <div className={`w-1/2 aspect-square bg-foreground rounded-full group-hover:bg-highlight-hover transition-transform
                        ${theme === "light" ? "translate-x-0 group-active:translate-x-full" : "translate-x-full group-active:translate-x-0"}`} />
                </button>
                <p className="font-semibold">{theme === "light" ? "Light" : "Dark"}</p>
            </div>
        </div>
    )
}