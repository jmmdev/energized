import { useSession } from "next-auth/react";
import { FaSpinner, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import DeckListDisplay from "./deck-list-display";

export default function UserFavorites({favorites}) {
    const {data: session, status} = useSession();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (status !== "loading")
            setIsLoading(false);
    }, [status])

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium">Favorite decks</h1>
            <div className="flex flex-col gap-2 bg-background-1 rounded-lg p-4 md:p-8">
                {isLoading ? <FaSpinner className="text-4xl self-center animate-spin" /> :
                <DeckListDisplay decks={favorites} isFav={true} />}
            </div>
        </div>
    )
}