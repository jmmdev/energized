"use client";

import { useState } from "react";
import AdminPanelTab from "./admin-panel-tab";
import AdminContent from "./admin-content";
import { useSession } from "next-auth/react";
import Logo from "./logo";

export default function AdminPanel() {
    const {data: session, status} = useSession();
    const TABS = ["dashboard", "decks", "cards", "users", "moderation"];

    const [tab, setTab] = useState("dashboard");

    const GetTabs = () => {
        return (
            <nav className="w-full flex-1 lg:max-w-[400px] text-lg flex flex-col rounded-l-xl border-r border-background-2">
                {
                    TABS.map(t =>
                        <AdminPanelTab key={t} tab={tab} setTab={setTab} name={t} />
                    )
                }
            </nav>
        )
    }

    return (
        <>
            <main className="flex-1 w-full flex flex-col"> 
                <header className="flex h-12 items-center justify-between px-4 border-b border-background-2">
                    <Logo isInHeader />
                </header>
                <section className="w-full max-w-[1920px] self-center flex-1 flex flex-col lg:flex-row">
                    <GetTabs />
                    <AdminContent tab={tab} />
                </section>
            </main>
        </>
    )
}