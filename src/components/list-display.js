import { useRouter } from "next/navigation";
import Pagination from "./pagination";
import { useState } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function ListDisplay({type, list, name, isOwn, isFav}) {
    const {data: session, status} = useSession();
    const router = useRouter();

    const [pageNumber, setPageNumber] = useState(0);
    
    const PER_PAGE = 12;

    const getDeckDate = (deck) => {
        const date = new Date(deck.createdAt);
        return date.toLocaleDateString("en-GB");
    }

    if (status === "loading")
        return null;

    let listToShow;

    if (!isOwn || type !== "decks")
        listToShow = [...list];
    else {
        if (session)
            listToShow = list.filter((deck) => deck.creator.id === session.user?.id || (deck.visible && deck.cardCount === 60));
        else
            listToShow = list.filter((deck) => deck.visible && deck.cardCount === 60);
    }

    if (listToShow.length > 0) {
        const startIndex = pageNumber * PER_PAGE;
        const endIndex = startIndex + PER_PAGE;

        const subList = listToShow.slice(startIndex, endIndex);

        return (
            <div className="flex flex-col h-full gap-4">
                {!isOwn && !isFav && 
                    <h1 className="text-4xl font-bold"><span className="capitalize">{type.slice(0, -1)}</span> search results for "{name}"</h1>
                }
                <p className="text-lg">{listToShow.length} results</p>
                <div className={`w-full flex-1 ${type === "users" ? "flex flex-wrap gap-4" : "flex flex-col"}`}>
                    {
                        subList.map((elem, index) => {
                            if (type === "decks")
                                return (
                                    <div key={elem._id}>
                                        <div className="flex w-full items-center cursor-pointer group hover:text-highlight relative has-[.child:hover]:hover:text-foreground">
                                            <div className="hidden sm:block w-12 aspect-square relative">
                                                <Image width={200} height={200} src={elem.image} alt="Deck's image" />
                                            </div>
                                            <div className={`flex flex-1 justify-between items-center p-2 
                                                ${index % 2 === 0 ? "bg-background-1" : "bg-background-2"}`}>
                                                <a className="text-lg font-medium" href={`/deck/${elem._id}`}>{elem.name}</a>
                                                <p className="text-sm">
                                                    {!isOwn && 
                                                    <a className="child flex items-center gap-1 font-light cursor-pointer group-hover:text-foreground hover:text-highlight relative z-30" 
                                                    href={`/user/${elem.creator.name}`} onClick={(e) => e.stopPropagation()}>
                                                        <FaUser />
                                                        {elem.creator.name}
                                                    </a>}
                                                    
                                                    {!isFav && 
                                                        <span className="group-hover:text-foreground">
                                                            {isOwn &&
                                                            <>
                                                            Created:
                                                            <br/>
                                                            </>
                                                            }
                                                            {getDeckDate(elem)}
                                                        </span>
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            if (type === "users")
                                return (
                                    <div className="w-full sm:w-fit" key={elem._id}>
                                        <a className={`flex w-full items-center cursor-pointer group hover:text-highlight relative has-[.child:hover]:hover:text-foreground p-2 rounded-full
                                        ${index % 2 === 0 ? "bg-background-1" : "bg-background-2"}`}
                                        href={`/user/${elem.name}`}>
                                            <div className="w-8 aspect-square relative">
                                                <Image className="rounded-full" width={200} height={200} src={elem.image} alt="User's image" />
                                            </div>
                                            <p className="text-xl font-medium px-2">{elem.name}</p>
                                        </a>
                                    </div>
                                )
                        })
                    }
                    {listToShow.length > PER_PAGE && <Pagination list={listToShow} pageNumber={pageNumber} setPageNumber={setPageNumber} perPage={PER_PAGE} />}
                </div>
            </div>
        )
    }
    
    if (isOwn) {
        return (
            <div className="bg-background-1 rounded-lg p-4 md:p-8">
                <p className="text-center text-lg opacity-60">This user did not create any decks yet</p>
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