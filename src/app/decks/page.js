"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Decks() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [decks, setDecks] = useState(null);

    useEffect(() => {
        const getDecks = async () => {
            const decksInfo = await axios.get(`http://localhost:3500/api/decks/search/${searchParams.get("name")}`);
            
            setDecks(decksInfo);
        }
        getDecks();
    }, [])

    if (decks) {
        if (decks.length > 0)
            return (
                <p>{`"${router.query.name}" decks (${decks.length} results)`}</p>
            )

        return(
            <p>No results</p>
        )
    }
    return (
        <p>Loading...</p>
    )
}