"use client";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import ViewDeckListCard from "@/components/view-deck-list-card";
import { FaArrowAltCircleUp, FaArrowAltCircleLeft, FaUser, FaGripHorizontal, FaList, FaStar, FaRegStar } from "react-icons/fa";
import CardGrid from "@/components/card-grid";
import BuilderDeckTopButton from "@/components/builder-deck-top-button";

export default function Deck() {
    const {data: session, status} = useSession();
    const params = useParams();

    const [deck, setDeck] = useState(null);
    const [display, setDisplay] = useState("grid");
    const [isFavorite, setIsFavorite] = useState(null);
    
    useEffect(() => {
        const initialize = async () => {
            const deckResponse = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/decks/${params.id}`);
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
        if (status !== "loading")
            initialize();
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

    if (deck)
        return (
            <div className={`${deck.cards.length <= 0 ? "flex" : ""} flex-1`}>
                {
                deck.cards.length > 0
                ?
                    <div className="flex justify-center">
                        <div className="w-full max-w-[1350px]">
                            <div className="flex flex-col gap-2 p-4 md:p-8 xl:p-12 pb-[0_!important]">
                                <div className="flex justify-between">
                                    <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold">{deck.name}</h1>
                                    {session && session?.user.id !== deck.creator.id &&
                                    <button onClick={modifyFavorite} className="group text-4xl cursor-pointer hover:opacity-70">
                                        {isFavorite === true 
                                            ? <FaStar className="text-yellow-500"/> 
                                            : <>
                                                <FaRegStar className="text-foreground group-hover:hidden" />
                                                <FaStar className="hidden text-foreground group-hover:block" />
                                            </> 
                                        }
                                    </button>
                                    }
                                </div>
                                <div className="w-full flex items-center justify-between">
                                    <a className="w-fit flex items-center cursor-pointer hover:text-highlight md:text-lg xl:text-xl gap-2 font-light"
                                    href={`/user/${deck.creator.name}`}>
                                        <FaUser />
                                        <h2 className="underline">{deck.creator.name}</h2>
                                    </a>
                                    <div className="self-end flex gap-2">
                                        <BuilderDeckTopButton content={<FaGripHorizontal />} onClick={() => setDisplay("grid")} selected={display === "grid"} />
                                        <BuilderDeckTopButton content={<FaList />} onClick={() => setDisplay("list")} selected={display === "list"} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 md:p-8 xl:p-12">
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
                        </div>
                    </div>
                :
                    <div className="flex flex-col lg:flex-row flex-1 items-center justify-center opacity-40 gap-2">
                        <FaArrowAltCircleUp className="animate-bounce lg:hidden text-3xl lg:text-4xl xl:text-5xl" />
                        <FaArrowAltCircleLeft className="animate-slide hidden lg:block text-3xl lg:text-4xl xl:text-5xl" />
                        <p className="text-2xl sm:text-3xl xl:text-4xl">Search and add cards to your deck</p>
                    </div>
                }
            </div>
        )

    return null;
}