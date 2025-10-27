"use client";
import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminPanel from "@/components/admin-panel";

export default function Admin() {
    const router = useRouter();
    const {data: session, status} = useSession();

    useEffect(() => {
        if (session && session.user?.role !== "admin")
            router.push("/");
    }, [session])
    
    if (status === "loading")
        return null;

    if (!session)
        return <LoginForm onLoginSuccess={refreshSession} />
    
    if (session?.user.role === "admin")
        return (
            <AdminPanel />
        )
}
    
async function refreshSession() {
    await getSession({ triggerEvent: true });
}