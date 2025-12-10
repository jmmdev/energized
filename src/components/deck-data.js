"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser, FaGripHorizontal, FaList, FaStar, FaRegStar, FaEdit, FaTrashAlt, FaChartBar, FaCopy, FaCaretLeft } from "react-icons/fa";
import CardDisplay from "./card-display";
import BuilderDeckTopButton from "@/components/builder-deck-top-button";
import Footer from "@/components/footer";
import DeckStats from "@/components/deck-stats";
import Button from "@/components/button";
import Drawer from "./drawer";
import Link from "next/link";
import { getSimpleStats } from "@/utils/simple-stats";
import { useNavigation } from "@/context/navigation-context";

export default function DeckData({data}) {
    const {data: session, status} = useSession();
    const router = useRouter();
    const { lastPage } = useNavigation();

    const [display, setDisplay] = useState("grid");
    const [isFavorite, setIsFavorite] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteText, setDeleteText] = useState("");
    
    useEffect(() => {
        const initialize = async () => {
            if (status === "authenticated") {
                const favResponse = await axios.get(`/api/xapi/favorites`,
                {
                    withCredentials: true
                });

                const favsData = favResponse.data;
                setIsFavorite(favsData.includes(data._id));
            }
        }
        if (status !== "loading") {
            initialize();
        }
    }, [status])

    const handleBack = () => {
        router.push(lastPage || "/");
    };

    const modifyFavorite = async () => {
        await axios.post("/api/xapi/favorites", {
            deckId: data._id
        },
        {
            withCredentials: true
        });
        
        setIsFavorite(!isFavorite);
    }

    const doDelete = async () => {
        await axios.delete(`/api/xapi/decks`,
            {
                withCredentials: true,
                data: {
                    deckId: data._id
                }
            },
        );
        router.replace(`/user/${session?.user?.name}`);
    }

    const getDeckDate = (deck) => {
        const date = new Date(deck.lastModified);
        return date.toLocaleDateString("en-GB");
    }

    const parseFrom = () => {
        if (lastPage.startsWith("/search"))
            return "search";

        const steps = lastPage.split("/").filter(i => i);

        if (steps.length > 0)
            return steps.join(" → ");

        return "home";
    }

    if (status !== "loading")
        return (
            <div className="relative w-full flex flex-col lg:flex-row lg:justify-center flex-1 overflow-y-hidden self-center">
                {data.cardCount === 60 && 
                <Drawer drawerIcon={<FaChartBar />} >
                    <DeckStats stats={getSimpleStats(data.cards)} />
                </Drawer> 
                }
                <div className="w-full flex flex-1 justify-center overflow-y-auto builder-scrollbar">
                    <div className="flex flex-col w-full lg:max-w-[1500px] h-full">
                        <div className="flex flex-col flex-1 gap-4 lg:gap-2 p-8">
                            <div className="flex flex-col justify-between gap-4">
                                <div className="flex flex-col w-full lg:flex-row lg:justify-between lg:items-center gap-4 lg:gap-0">
                                    <div className="w-full">
                                        <button className="flex gap-1 font-medium items-center cursor-pointer underline hover:text-highlight" onClick={handleBack}>
                                            <FaCaretLeft /> Go back to {parseFrom()}
                                        </button>
                                        <div className="w-full flex justify-between items-center gap-8">
                                            <div className="flex gap-2 items-center">
                                                <h1 className="flex-1 truncate text-3xl sm:text-4xl lg:text-5xl font-bold py-2">
                                                    {data.name}
                                                </h1>
                                                <Button color="blue" className="rounded-full text-xs p-1.5"
                                                onClick={() => {
                                                    const url = window.location;
                                                    navigator.clipboard.writeText(url);
                                                    alert("Deck link copied successfully!");
                                                }}>
                                                    <FaCopy />
                                                </Button>
                                            </div>
                                            {session && session?.user.id === data.creator.id &&
                                                <div className="hidden md:flex gap-4 ">
                                                    <Link className="flex items-center gap-1 uppercase px-4 py-1 rounded bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-my-white"
                                                    href={`/build/${data._id}`}>
                                                        <FaEdit />
                                                        Edit
                                                    </Link>
                                                    <Button color="none" onClick={() => setShowConfirmDelete(true)}
                                                    className="font-medium text-red-400 px-4 py-1 border-2 border-red-400 rounded hover:bg-red-400 hover:text-my-white
                                                    active:bg-red-500 active:text-my-white active:border-red-500">
                                                        <div className="flex items-center gap-1">
                                                            <FaTrashAlt />
                                                            Delete
                                                        </div>    
                                                    </Button>
                                                </div>
                                            }
                                        </div>
                                        <div className="flex flex-col lg:justify-between sm:flex-row sm:items-center gap-2 sm:gap-8">
                                            <p className="font-light opacity-70">Last modified: {getDeckDate(data)}</p>
                                            <div className="flex items-center gap-4 md:hidden">
                                                <Link className="w-fit flex items-center cursor-pointer hover:text-highlight md:text-lg xl:text-xl gap-2 font-light"
                                                href={`/user/${data.creator.name}`}>
                                                    <FaUser />
                                                    <h2>{data.creator.name}</h2>
                                                </Link>
                                                <div className="flex items-center gap-1">
                                                    {session && data.cardCount === 60 &&
                                                    <>
                                                        {session?.user.id !== data.creator.id ?
                                                        <button onClick={modifyFavorite} className="group text-2xl cursor-pointer hover:opacity-70 active:opacity-100">
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
                                                    </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-4">
                                    <Link className="w-fit flex items-center cursor-pointer hover:text-highlight md:text-lg xl:text-xl gap-2 font-light"
                                    href={`/user/${data.creator.name}`}>
                                        <FaUser />
                                        <h2 className="underline">{data.creator.name}</h2>
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        {session && data.cardCount === 60 &&
                                        <>
                                        {session?.user.id !== data.creator.id ?
                                            <button onClick={modifyFavorite} className="group text-2xl cursor-pointer hover:opacity-70 active:opacity-85">
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
                                        </>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between md:justify-end gap-4 items-center mb-4">
                                {session && session?.user.id === data.creator.id &&
                                    <div className="flex md:hidden gap-4">
                                        <Link className="flex items-center gap-1 uppercase px-2 py-0.5 text-sm rounded bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-my-white"
                                        href={`/build/${data._id}`}>
                                            <FaEdit />
                                            Edit
                                        </Link>
                                        <Button color="none" onClick={() => setShowConfirmDelete(true)}
                                        className="font-medium text-red-400 px-2 py-0.5 border-2 border-red-400 rounded hover:bg-red-400 hover:text-my-white
                                        active:bg-red-500 active:text-my-white active:border-red-500">
                                            <div className="flex items-center gap-1">
                                                <FaTrashAlt />
                                                Delete
                                            </div>
                                        </Button>
                                    </div>
                                }
                                {data.cards.length > 0 &&
                                    <div className="flex gap-2">
                                        <BuilderDeckTopButton onClick={() => setDisplay("grid")} selected={display === "grid"}>
                                            <FaGripHorizontal />
                                        </BuilderDeckTopButton>
                                        <BuilderDeckTopButton onClick={() => setDisplay("list")} selected={display === "list"}>
                                            <FaList />    
                                        </BuilderDeckTopButton>
                                    </div>
                                }
                            </div>
                            
                        {data.cards.length > 0 
                        ?
                            <CardDisplay cards={data.cards} display={display} />
                        : 
                            <div className="flex-1">
                                <div className="flex items-center justify-center h-full text-2xl md:text-3xl opacity-60 text-center bg-background-1 rounded-xl p-8">
                                    <p>This deck has no cards yet</p>
                                </div>
                            </div>
                        }
                        </div>
                        <Footer />
                    </div>
                </div>
                {showConfirmDelete &&
                    <div className="absolute top-0 left-0 z-30 p-8 w-screen h-screen bg-[#000c] flex justify-center items-center">
                        <div className="w-full max-w-[600px] flex flex-col gap-4 p-8 bg-background-1 rounded-lg">
                            <p className="text-lg">Type <span className="font-bold">delete</span> to delete this deck</p>
                            <input className="w-full bg-background-2" autoFocus value={deleteText} onChange={(e) => setDeleteText(e.target.value.trim())} />
                            <p className="uppercase text-sm font-semibold text-yellow-500">warning: this action cannot be undone</p>
                            <div className="w-full flex justify-center items-center gap-8 font-medium">
                                <Button color="gray" className="px-4 py-1 rounded" onClick={() => setShowConfirmDelete(false)}>
                                    Cancel
                                </Button>
                                <Button color="red" className="px-4 py-1 rounded" onClick={doDelete} 
                                disabled={deleteText.toLowerCase() !== "delete"}>
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )

    return null;
}