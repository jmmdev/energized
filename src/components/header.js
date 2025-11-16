"use client";
import SearchBar from "@/components/search-bar";
import Logo from "@/components/logo";
import { useEffect, useRef, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import SideMenu from "@/components/side-menu";
import CompactLogin from "./compact-login";
import {FaHammer, FaUserCog, FaTimes, FaBars, FaUser} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Button from "./button";
import axios from "axios";
import Link from "next/link";

export default function Header() {
    const router = useRouter();
    const {data: session, status} = useSession();

    const [showCreateDeck, setShowCreateDeck] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (status !== "loading") {
            setLoaded(true);
        }
    }, [session])

    useEffect(() => {
        setShowMenu(false);
    }, [showCreateDeck])

    const CreateDeckPrompt = () => {
        const [deckName, setDeckName] = useState("Unnamed deck");
        const [showErrorMsg, setShowErrorMsg] = useState(false);
        const errorMsg = useRef("[empty]");

        const createDeck = async () => {
            try {
                const response = await axios.post(`/api/xapi/decks`, {
                    data: {
                        creator: {
                            id: session.user?.id,
                            name: session.user?.name
                        },
                        name: deckName,
                        cards: [],
                        image: "/assets/images/deck-logo-0.png",
                        legal: {
                            standard: false,
                            expanded: false,
                        },
                        cardCount: 0,
                        visible: true,
                    },
                },
                {
                    withCredentials: true
                });

                const deckId = response.data._id;
                router.push(`/build/${deckId}`);
            } catch (e) {
                errorMsg.current = e.message;
                setShowErrorMsg(true);
            }
        }
        if (showCreateDeck)
            return (
                <div className="fixed z-100 top-0 w-screen h-screen overflow-hidden flex justify-center items-center p-4 bg-[#000c]">
                    <div className="flex flex-col w-full max-w-[640px] p-8 bg-background-1 rounded-lg gap-4">
                        <h1 className="text-3xl font-bold">Create a new deck</h1>
                        <input className="bg-background-2 text-xl text-foreground rounded" value={deckName} onChange={(e) => setDeckName(e.target.value)} />
                        <p className={`${showErrorMsg ? "visible" : "invisible"} h-fit text-red-400`}>{errorMsg.current}</p>
                        <div className="flex w-full justify-center gap-4 lg:gap-8">
                            <Button color="gray" onClick={() => setShowCreateDeck(false)} className="w-1/2 max-w-[250px] rounded px-4 py-2">
                                cancel
                            </Button>
                            <Button color="blue" onClick={createDeck} className="w-1/2 max-w-[250px] rounded px-4 py-2 font-bold">
                                save & build
                            </Button>
                        </div>
                    </div>
                </div>
            )
    }

    const GetHeaderElements = () => {
        return (
            <>
                {!session ?
                <div className="w-full flex justify-end">
                    <div className="hidden lg:block">
                        <CompactLogin onLoginSuccess={refreshSession} />
                    </div>
                    <Button color="blue" className="block lg:hidden rounded-xs px-2 text-my-white" onClick={() => setShowMenu(true)}>
                        Log in
                    </Button>
                </div>
                :
                <div className="flex justify-center gap-4 w-full">
                        <Link className="flex flex-col md:flex-row gap-1 md:gap-2 justify-center items-center text-2xl hover:text-highlight cursor-pointer"
                        href={`/user/${session?.user?.name}`}>
                            <FaUser />
                            <p className="hidden uppercase md:block text-sm">{session?.user?.name}</p>
                        </Link>
                        <button className="flex flex-col md:flex-row gap-1 md:gap-2 justify-center items-center text-2xl hover:text-highlight cursor-pointer"
                        onClick={() => setShowCreateDeck(true)}>
                            <FaHammer />
                            <p className="hidden uppercase md:block text-sm">build</p>
                        </button>
                </div>
                }
            </>
        )
    }

    if (!loaded)
        return null;

    return (
        <>
            <header className="w-full fixed top-0 z-99"
            onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
            }}>
                <div className="flex bg-background justify-between items-center h-12 px-4 gap-4">
                    <Logo isInHeader />
                    {(session?.user?.role === "admin" || session?.user?.role === "owner") && 
                        <Link className="flex flex-col md:flex-row gap-1 md:gap-2 justify-center items-center text-3xl hover:text-highlight cursor-pointer"
                        href="/admin">
                            <FaUserCog />
                            <p className="hidden uppercase md:block text-sm">admin</p>
                        </Link>
                    }
                    <div className="flex-1 h-full flex items-center justify-between gap-4">
                        <GetHeaderElements />
                    </div>
                    <button className="text-foreground text-3xl font-bold cursor-pointer hover:text-highlight transition-all" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}>
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <div className="flex items-center h-12 bg-background-1">
                    <div className="color-background w-full h-full flex justify-center items-center gap-2 py-2 px-4">
                        <SearchBar />
                    </div>
                </div>
            </header>
            <SideMenu showMenu={showMenu} setShowMenu={setShowMenu} />
            <CreateDeckPrompt />
        </>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}