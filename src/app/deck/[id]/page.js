"use client";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import ViewDeckListCard from "@/components/view-deck-list-card";
import { FaUser, FaGripHorizontal, FaList, FaStar, FaRegStar, FaEdit, FaTrashAlt } from "react-icons/fa";
import CardGrid from "@/components/card-grid";
import BuilderDeckTopButton from "@/components/builder-deck-top-button";
import Footer from "@/components/footer";
import DeckStats from "@/components/deck-stats";
import Button from "@/components/button";

export default function Deck() {
    const {data: session, status} = useSession();
    const params = useParams();
    const router = useRouter();

    const [deck, setDeck] = useState(null);
    const [display, setDisplay] = useState("grid");
    const [isFavorite, setIsFavorite] = useState(null);
    
    useEffect(() => {
        const initialize = async () => {
            const deckResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/decks?id=${params.id}`);
            const deckData = deckResponse.data;
            
            setDeck(deckData);
            
            if (status === "authenticated") {
                const favResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/favorites`,
                {
                    withCredentials: true
                });

                const favsData = favResponse.data;
                setIsFavorite(favsData.includes(deckData._id));
            }
        }
        if (status !== "loading") {
            initialize();
        }
    }, [status])

    const modifyFavorite = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/favorites`, {
            deckId: deck._id
        },
        {
            withCredentials: true
        });
        
        setIsFavorite(!isFavorite);
    }

    const doDelete = async () => {
        if (confirm(`WARNING: You will delete this deck. This action cannot be undone. Are you sure?`)) {
            try {
                const deleted = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/decks`,
                {
                    withCredentials: true,
                    data: {
                        deckId: deck._id
                    }
                },
            );
                console.log(deleted);
                router.replace(`/user/${session?.user?.name}`);
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    const getDeckDate = (deck) => {
        const date = new Date(deck.lastModified);
        return date.toLocaleDateString("en-GB");
    }

    if (deck)
        return (
                <div className="relative w-full flex flex-col lg:flex-row justify-center flex-1 overflow-y-hidden max-w-[1920px] self-center">
                    <div className="flex flex-col w-full h-full lg:w-2/3 overflow-y-auto">
                        <div className="flex flex-col gap-4 lg:gap-2 p-8">
                            <div className="flex flex-col justify-between gap-4">
                                <div className="flex flex-col w-full lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-0">
                                    <div className="w-full">
                                        <h1 className="w-full max-w-[90%] truncate text-3xl/10 md:text-4xl/12 xl:text-5xl/14 font-bold">
                                            {deck.name}
                                        </h1>
                                        <div className="flex flex-col lg:justify-between sm:flex-row sm:items-center gap-2 sm:gap-8">
                                            <p className="font-light opacity-70">Last modified: {getDeckDate(deck)}</p>
                                            <div className="flex items-center gap-4 lg:hidden">
                                                <a className="w-fit flex items-center cursor-pointer hover:text-highlight md:text-lg xl:text-xl gap-2 font-light"
                                                href={`/user/${deck.creator.name}`}>
                                                    <FaUser />
                                                    <h2>{deck.creator.name}</h2>
                                                </a>
                                                <div className="flex items-center gap-1">
                                                    {session && session?.user.id !== deck.creator.id ?
                                                    <button onClick={modifyFavorite} className="group text-2xl cursor-pointer hover:opacity-70">
                                                        {isFavorite === true 
                                                            ? <FaStar className="text-yellow-500"/> 
                                                            : <>
                                                                <FaRegStar className="text-foreground group-hover:hidden" />
                                                                <FaStar className="hidden text-foreground group-hover:block" />
                                                            </> 
                                                        }
                                                    </button>
                                                    :
                                                    <div className="text-2xl opacity-70">
                                                        <FaStar />
                                                    </div>
                                                    }
                                                    <p className="font-light italic">
                                                        {`${deck.favCount} favorite${deck.favCount !== 1 ? "s" : ""}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {session && session?.user.id === deck.creator.id &&
                                        <div className="hidden 2xl:flex gap-4 ">
                                            <a className="flex items-center gap-1 uppercase px-4 py-1 rounded bg-blue-500 hover:bg-blue-400 active:bg-blue-600"
                                            href={`/build/${deck._id}`}>
                                                <FaEdit />
                                                Edit
                                            </a>
                                            <Button color="none" onClick={() => doDelete()} content={
                                                <div className="flex items-center gap-1">
                                                    <FaTrashAlt />
                                                    Delete
                                                </div>}
                                            style="font-medium text-red-400 px-4 py-1 border-2 border-red-400 rounded hover:bg-red-400 hover:text-my-white
                                            active:bg-red-500 active:text-my-white active:border-red-500" />
                                        </div>
                                    }
                                </div>
                                <div className="hidden lg:flex items-center gap-4">
                                    <a className="w-fit flex items-center cursor-pointer hover:text-highlight md:text-lg xl:text-xl gap-2 font-light"
                                    href={`/user/${deck.creator.name}`}>
                                        <FaUser />
                                        <h2>{deck.creator.name}</h2>
                                    </a>
                                    <div className="flex items-center gap-1">
                                        {session && session?.user.id !== deck.creator.id ?
                                        <button onClick={modifyFavorite} className="group text-2xl cursor-pointer hover:opacity-70">
                                            {isFavorite === true 
                                                ? <FaStar className="text-yellow-500"/> 
                                                : <>
                                                    <FaRegStar className="text-foreground group-hover:hidden" />
                                                    <FaStar className="hidden text-foreground group-hover:block" />
                                                </> 
                                            }
                                        </button>
                                        :
                                        <div className="text-2xl opacity-70">
                                            <FaStar />
                                        </div>
                                        }
                                        <p className="font-light italic">
                                            {`${deck.favCount} favorite${deck.favCount !== 1 ? "s" : ""}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between 2xl:justify-end gap-4 items-center mb-4">
                                {session && session?.user.id === deck.creator.id &&
                                    <div className="flex 2xl:hidden gap-4">
                                        <a className="flex items-center gap-1 uppercase px-2 py-0.5 text-sm rounded bg-blue-500 hover:bg-blue-400 active:bg-blue-600"
                                        href={`/build/${deck._id}`}>
                                            <FaEdit />
                                            Edit
                                        </a>
                                        <Button color="none" onClick={() => doDelete()} content={
                                                <div className="flex items-center gap-1">
                                                    <FaTrashAlt />
                                                    Delete
                                                </div>}
                                            style="font-medium text-red-400 px-2 py-0.5 border-2 border-red-400 rounded hover:bg-red-400 hover:text-my-white
                                            active:bg-red-500 active:text-my-white active:border-red-500" />
                                    </div>
                                }
                                {deck.cards.length > 0 &&
                                    <div className="flex gap-2">
                                        <BuilderDeckTopButton content={<FaGripHorizontal />} onClick={() => setDisplay("grid")} selected={display === "grid"} />
                                        <BuilderDeckTopButton content={<FaList />} onClick={() => setDisplay("list")} selected={display === "list"} />
                                    </div>
                                }
                            </div>
                            
                        {deck.cards.length > 0 ?
                        <div className="flex-1">
                            {
                            display === "grid"
                            ?
                                <CardGrid cards={deck.cards} />
                            :
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
                                {
                                    deck.cards.map((elem) => {
                                        return <ViewDeckListCard key={"list"+elem.card.id} elem={elem} />
                                    })
                                }
                                </div>
                            }
                        </div>
                        : 
                        <div className="flex-1 p-8">
                            <div className="flex items-center justify-center h-full text-2xl md:text-3xl opacity-60 text-center bg-background-1 rounded-xl p-8">
                                <p>This deck has no cards yet</p>
                            </div>
                        </div>
                        }
                        </div>
                        <Footer />
                    </div>
                    {deck.cardCount === 60 && <DeckStats deck={deck.cards} />}
                </div>
        )

    return null;
}