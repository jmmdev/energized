"use client";

import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    const router = useRouter();
    const {data: session, status} = useSession();
    
    useEffect(() => {
        if (session)
            router.replace("/");
    }, [session])

    if (status === "loading")
        return null;

    if (!session)
        return <LoginForm onLoginSuccess={refreshSession} />
    
    return null;
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}