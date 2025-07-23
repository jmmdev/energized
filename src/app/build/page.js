"use client";
import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";

export default function Build() {
    const {data: session, status} = useSession();

    if (status === "loading")
        return null;

    if (!session)
        return <LoginForm onLoginSuccess={refreshSession} />

    return (
        <p>{JSON.stringify(session.user)}</p>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}