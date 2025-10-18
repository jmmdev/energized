"use client";
import Builder from "@/components/builder";
import { useParams, useRouter } from "next/navigation";
import {DeckProvider} from "@/context/deck-context";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DeckContextHeader from "@/components/deck-context-header";

export default function BuildEdit() {
    const router = useRouter();
    const {data: session, status} = useSession();
    const params = useParams();
    
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (status !== "loading")
            setIsLoading(false);
    }, [status])
    
    useEffect(() => {
        if (!isLoading && !(session?.user))
            router.replace("/");
    }, [isLoading])

    if (!isLoading && session?.user)
        return (
            <DeckProvider>
                <DeckContextHeader />
                <Builder deckId={params.id} />
            </DeckProvider>
        );

    return null;
}