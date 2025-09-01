import { useSession } from "next-auth/react";
import { FaSpinner, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function UserFavorites({name, favorites, removeFavorite}) {
    const {data: session, status} = useSession();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (status !== "loading")
            setIsLoading(false);
    }, [status])

    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-medium">Favorite decks</h1>
            <div className="flex flex-col gap-2 bg-background-1 rounded-lg p-8">
                {isLoading ? <FaSpinner className="text-4xl self-center animate-spin" /> :
                favorites.length > 0 ?
                <>
                {
                    favorites.map((fav) => {
                        return (
                            <div key={deck._id} className="flex gap-1">
                                <div className="flex flex-1 justify-between items-center px-4 py-1 bg-background-2 cursor-pointer hover:text-sky-400">
                                    <a className="text-lg font-medium" href={`/deck/${fav.deck._id}`}>{deck.name}</a>
                                    <a className="text-sm font-light" href={`/user/${fav.creator.name}`}>Created by: {fav.creator.name}</a>    
                                </div>
                                {session.user?.id === fav.creator.id &&
                                <button className="group w-fit cursor-pointer" onClick={() => removeFavorite(fav)}>
                                    <FaStar className="group-hover:opacity-60 text-xl text-yellow-500" /> 
                                </button>}
                            </div>
                        )
                    })
                }
                </>  
                : <p className="text-center text-lg opacity-60">{name} has no favorites yet</p>}
            </div>
        </div>
    )
}