"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Deck() {
    const router = useRouter();
    const {data: session, status} = useSession();
    const params = useParams();

    const [deck, setDeck] = useState(null);
    
    useEffect(() => {
        const initialize = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/decks/${params.id}`);
            setDeck(response.data);
        }
        initialize();
    }, [])

    if (deck)
        return (
            <p>{JSON.stringify(deck)}</p>
    )

    return null;
}