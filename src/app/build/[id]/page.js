"use client";
import Builder from "@/components/builder";
import { useParams } from "next/navigation";
import {DeckProvider} from "@/context/deck-context";

export default function BuildEdit() {
    const params = useParams();

    return (
        <DeckProvider>
            <Builder deckId={params.id} />
        </DeckProvider>
    )
}