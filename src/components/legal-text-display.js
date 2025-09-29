"use client";
import { useSession } from "next-auth/react"

export default function LegalTextDisplay({children}) {
    const {data, status} = useSession();

    if (status !== "loading")
        return (
            <main className="flex justify-center p-8 xl:p-12">
                <section className="max-w-[1200px]">
                    {children}
                </section>
            </main>
        )
    
    return null;
}