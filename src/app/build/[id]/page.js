"use client";
import Builder from "@/components/builder";
import { useParams } from "next/navigation";

export default function BuildEdit() {
    const params = useParams();

    return (
        <Builder deckId={params.id} />
    )
}