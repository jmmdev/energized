import { useSession } from "next-auth/react";
import { FaSpinner} from "react-icons/fa";
import { useEffect, useState } from "react";
import DeckListDisplay from "./deck-list-display";

export default function UserDecks({decks}) {
    const {data: session, status} = useSession();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (status !== "loading")
            setIsLoading(false);
    }, [status])

    return (
        <section className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium">Created decks</h1>
            <div className="flex flex-col">
                {isLoading ? <FaSpinner className="text-4xl self-center animate-spin" /> :
                <DeckListDisplay decks={decks} isOwn={true} />
                }
            </div>
        </section>
    )
}