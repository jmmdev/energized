"use client";
import Builder from "@/components/builder";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {DeckProvider} from "@/context/deck-context";

export default function BuildNew() {
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

    if (!isLoading && session?.user)
        return (
            <DeckProvider>
                <Builder isNew />
            </DeckProvider>
        );

    return null;
}