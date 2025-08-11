"use client";
import Builder from "@/components/builder";
import { useParams, useRouter } from "next/navigation";
import {DeckProvider} from "@/context/deck-context";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function BuildEdit() {
    const router = useRouter();
    const {data: session, status} = useSession();
    
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (status !== "loading")
            setIsLoading(false);
    }, [status])
    
    useEffect(() => {
        if (!isLoading && !(session?.user))
            router.replace("/");
    }, [isLoading])


    const params = useParams();
    if (!isLoading && session?.user)
        return (
            <DeckProvider>
                <Builder deckId={params.id} />
            </DeckProvider>
        );

    return null;
}