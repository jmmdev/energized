"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DeckListDisplay from "@/components/deck-list-display";

export default function DeckSearch() {
    const {data: session, status} = useSession();
    const searchParams = useSearchParams();

    const [decks, setDecks] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getDecks = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/decks/search/${searchParams.get("name")}`);
            setDecks(response.data);
        }
        getDecks();
    }, [searchParams.get("name")])

    useEffect(() => {
        if (decks && (status !== "loading")){
            setIsLoading(false);
        }
    }, [decks, status])

    if (!isLoading) {
       return (
            <div className="w-full flex justify-center">
                <div className="w-full flex flex-col max-w-[1000px] justify-center p-4 md:p-8 xl:p-12 gap-4">
                    <DeckListDisplay decks={decks} name={searchParams.get("name")} />
                </div>
            </div>
        )
    }
    
    return null;
}