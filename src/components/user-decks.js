import { useSession } from "next-auth/react";
import { FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import Button from "./button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserDecks({name, decks, deleteDeck}) {
    const router = useRouter();
    const {data: session, status} = useSession();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (status !== "loading")
            setIsLoading(false);
    }, [status])
    
    const getDeckDate = (deck) => {
        const date = new Date(deck.createdAt);
        return date.toLocaleDateString("en-GB").replace(/\//g, "-");
    }

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium">Created decks</h1>
            <div className="flex flex-col">
                {isLoading ? <FaSpinner className="text-4xl self-center animate-spin" /> :
                decks.length > 0 ?
                <>
                {
                    decks.map((deck, index) => {
                        return (
                            <div key={deck._id} className="flex gap-1">
                                <a className="flex flex-1 items-center cursor-pointer hover:text-sky-400" href={`/deck/${deck._id}`}>
                                    <div className="w-12 aspect-square relative">
                                        <Image width={200} height={200} src={deck.image} alt="Deck's image" />
                                    </div>
                                    <div className={`flex flex-1 justify-between items-center p-4 h-12 ${index % 2 === 0 ? "bg-background-1" : "bg-background-2"}`}>
                                        <p className="text-xl font-medium">{deck.name}</p>
                                        <p className="font-light">Created: {getDeckDate(deck)}</p>    
                                    </div>
                                </a>
                            </div>
                        )
                    })
                }
                </>
                : <p className="text-center text-lg opacity-60">{name} did not create decks yet</p>}
            </div>
        </div>
    )
}