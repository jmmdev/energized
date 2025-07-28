"use client";
import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Build() {
    const router = useRouter();
    const {data: session, status} = useSession();
    
    const [deck, setDeck] = useState(null);

    useEffect(() => {
        const createDeck = async () => {
            const response = await axios.post("http://localhost:3500/api/decks", {
                creator: {
                    id: session.user?.id,
                    name: session.user?.name
                }
            });
            setDeck(response.data);
        }

        if (session)
            createDeck();
    }, [])

    useEffect(() => {
        if (deck)
            router.push(`/build/${deck._id}`);
    }, [deck])

    if (status === "loading")
        return null;

    if (!session)
        return <LoginForm onLoginSuccess={refreshSession} />

    return (
        <p>Loading...</p>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}