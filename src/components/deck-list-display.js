import { useRouter } from "next/navigation";
import Pagination from "./pagination";
import { useState } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

export default function DeckListDisplay({decks, name, isOwn, isFav}) {
    const router = useRouter();

    const [pageNumber, setPageNumber] = useState(0);
    
    const PER_PAGE = 12;

    const getDeckDate = (deck) => {
        const date = new Date(deck.createdAt);
        return date.toLocaleDateString("en-GB");
    }

    if (decks.length > 0) {
        const startIndex = pageNumber * PER_PAGE;
        const endIndex = startIndex + PER_PAGE;

        const subList = decks.slice(startIndex, endIndex);

        return (
            <div className="flex flex-col">
                {!isOwn && !isFav && 
                    <h1 className="text-3xl font-medium mb-4">Deck search results for "{name}"</h1>}
                {
                    subList.map((deck, index) => {
                        return (
                            <div key={deck._id}>
                                <button className="flex w-full items-center cursor-pointer group hover:text-highlight relative has-[.child:hover]:hover:text-foreground"
                                onClick={() => router.push(`/deck/${deck._id}`)}>
                                    <div className="hidden sm:block w-12 aspect-square relative">
                                        <Image width={200} height={200} src={deck.image} alt="Deck's image" />
                                    </div>
                                    <div className={`flex flex-1 flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:h-12 ${index % 2 === 0 ? "bg-background-1" : "bg-background-2"}`}>
                                        <p className="text-xl font-medium ">{deck.name}</p>
                                        <p className="text-sm sm:text-right">
                                            {!isOwn && 
                                            <a className="child flex items-center gap-1 font-light cursor-pointer group-hover:text-foreground hover:text-highlight relative z-30" 
                                            href={`/user/${deck.creator.name}`} onClick={(e) => e.stopPropagation()}>
                                                <FaUser />
                                                {deck.creator.name}
                                            </a>}
                                            
                                            {!isFav && 
                                                <span className="group-hover:text-foreground">
                                                    {isOwn &&
                                                    <>
                                                    Created:
                                                    <br/>
                                                    </>
                                                    }
                                                    {getDeckDate(deck)}
                                                </span>
                                            }
                                        </p>
                                    </div>
                                </button>
                            </div>
                        )
                    })
                }
                {decks.length > PER_PAGE && <Pagination list={decks} pageNumber={pageNumber} setPageNumber={setPageNumber} perPage={PER_PAGE} />}
            </div>
        )
    }
    
    if (isOwn) {
        return (
            <div className="bg-background-1 rounded-lg p-4 md:p-8">
                <p className="text-center text-lg opacity-60">You did not create any decks yet</p>
            </div>
        )
    }

    if (isFav) {
        return (
            <div className="bg-background-1 rounded-lg p-4 md:p-8">
                <p className="text-center text-lg opacity-60">There are no favorites yet</p>
            </div>
        )
    }

    return (
        <section className="flex justify-center items-center flex-1 p-12">
            <h1 className="text-3xl font-medium">{`No decks found for "${name}"`}</h1>
        </section>
    )
}