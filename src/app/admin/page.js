"use client";
import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Admin() {
    const router = useRouter();
    const {data: session, status} = useSession();

    useEffect(() => {
        if (session && session.user?.role !== "admin")
            setTimeout(() => {
                router.push("/");
            }, 3000);
    }, [session])
    
        if (status === "loading")
            return null;
    
        if (!session)
            return <LoginForm onLoginSuccess={refreshSession} />
        
        if (session?.user.role !== "admin")
            return (
                <div className="w-full h-[calc(100vh-240px)] flex justify-center items-center p-12">
                    <p className="text-5xl text-center font-bold">{"You're not authorized, redirecting..."}</p>
                </div>
            )

        return (
            <p>{JSON.stringify(session.user)}</p>
        )
    }
    
async function refreshSession() {
    await getSession({ triggerEvent: true });
}