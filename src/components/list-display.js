import { useRouter } from "next/navigation";
import Pagination from "./pagination";
import { useState } from "react";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function ListDisplay({type, list, name, isOwn, isFav, isHome, perPage}) {
    const {data: session, status} = useSession();

    const [pageNumber, setPageNumber] = useState(0);

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

        let subList;

        if (isHome)
            subList = [...listToShow];
        else {
            const startIndex = pageNumber * perPage;
            const endIndex = startIndex + perPage;

            subList = listToShow.slice(startIndex, endIndex);
        }

        return (
            <div className="flex flex-col h-full gap-4">
                {!isOwn && !isFav && !isHome &&
                    <h1 className="text-4xl font-bold"><span className="capitalize">{type.slice(0, -1)}</span> search results for "{name}"</h1>
                }
                {isHome &&
                    <h1 className="text-4xl font-bold">{name}</h1>
                }
                <div className={`w-full flex-1 ${type === "users" ? "flex flex-wrap gap-4" : "flex flex-col gap-2"}`}>
                    {
                        subList.map((elem, index) => {
                            if (type === "decks" || isHome)
                                return (
                                    <div key={elem._id}>
                                        <div className={`flex w-full items-center group relative has-[.child:hover]:hover:text-foreground rounded-full px-4 sm:px-2 py-2 gap-2
                                            ${index % 2 === 0 ? "bg-background-1" : "bg-background-2"}`}>
                                            <div className="hidden sm:block h-10 aspect-square relative">
                                                <Image width={200} height={200} className="rounded-full" src={elem.image} alt="Deck's image" />
                                            </div>
                                            <div className={`flex items-center gap-4 flex-1 h-full justify-between`}>
                                                <a className="text-lg sm:text-xl flex items-center font-medium hover:text-highlight" href={`/deck/${elem._id}`}>
                                                    <p>{elem.name}</p>
                                                </a>
                                                {!isOwn && 
                                                    <a className="child flex items-center gap-1 font-light cursor-pointer group-hover:text-foreground hover:text-highlight" 
                                                    href={`/user/${elem.creator.name}`} onClick={(e) => e.stopPropagation()}>
                                                        <FaUser />
                                                        {elem.creator.name}
                                                    </a>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            if (type === "users")
                                return (
                                    <div className="w-full sm:w-fit h-fit" key={elem._id}>
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
                </div>
                 {!isHome &&
                    <>
                    <p className="text-center p-2 font-light italic">{listToShow.length} result{listToShow.length > 1 ? "s" : ""}</p>
                        <>
                        {listToShow.length > perPage && <Pagination list={listToShow} pageNumber={pageNumber} setPageNumber={setPageNumber} perPage={perPage} />}
                        </>
                    </>
                }
            </div>
        )
    }
    
    if (isOwn) {
        return (
            <div className="bg-background-1 rounded-lg p-4 md:p-12 py-8">
                <p className="text-center text-lg opacity-60">
                    {`${session && session?.user?.name === name ? "You" : "This user"} did not create any decks yet`}
                </p>
            </div>
        )
    }

    if (isFav) {
        return (
            <div className="bg-background-1 rounded-lg p-4 md:p-12 py-8">
                <p className="text-center text-lg opacity-60">There are no favorites yet</p>
            </div>
        )
    }

    return (
        <section className="flex justify-center items-center flex-1">
            <h1 className="text-3xl font-medium">{`No ${type} found for "${name}"`}</h1>
        </section>
    )
}