"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BuildId() {
    const { id } = useParams();
    const {data: session, status} = useSession();
    
    const [deck, setDeck] = useState(null);

    useEffect(() => {
        const getDeck = async () => {
            const response = await axios.get(`http://localhost:3500/api/decks/${id}`);
            setDeck(response.data);
        }

        getDeck();
    }, [])

    if (deck)
        return (
            JSON.stringify(deck)
        )
    
    return null;
}