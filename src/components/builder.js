"use client";
import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaChartBar, FaSearch, FaSpinner, FaTimes, FaTools } from "react-icons/fa";
import BuilderCardSearch from "./builder-card-search";
import BuilderImageSelector from "./builder-image-selector";
import { useDeckContext } from "@/context/deck-context";
import BuilderDeckInfo from "./builder-deck-info";
import Drawer from "./drawer";
import DeckStats from "./deck-stats";
import {getSimpleStats} from "@/utils/simple-stats";

export default function Builder({deckId}) {
    const router = useRouter();
    const {data: session, status} = useSession();

    const {
        deckCreatorId, name, cards, cardQuantity, image, legal, visible, hasChanges,
        setHasChanges, deckError, closeDeckError, initializeDeck, waiting
    } = useDeckContext();

    const [showImgSelector, setShowImgSelector] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                await initializeDeck(deckId);

                if (deckCreatorId.current === session.user.id) {
                    setLoaded(true);
                }
                else
                    router.replace("/");
            } 
            catch (e) {
                router.replace("/");
            }
        }

        if (status === "authenticated" && session?.user && !loaded) {
            initialize();
        }
    }, [status]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasChanges]);

    useEffect(() => {
        if (!hasChanges && saving) {
            let timeout;
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                setSaving(false);
            }, 1000);
        }
    }, [hasChanges])

    useEffect(() => {
        const doSave = async () => {
            await axios.post(`/api/xapi/decks`, {
                deckId,
                data: {
                    name, cards, image, legal, visible, cardCount: cardQuantity
                },
            },
            {
                withCredentials: true

            });
            setHasChanges(false);
        }
        if (saving)
            doSave();
    }, [saving])

    useEffect(() => {
        if (cards)
            setStats(getSimpleStats(cards)); 
    }, [cards])

    const updateDeck = async () => {
        setSaving(true);
    }

    if (!loaded)
        return null;

    if (!session || !session.user)
        return <LoginForm onLoginSuccess={refreshSession} />

    return (
        <main className="relative w-full flex flex-col lg:flex-row justify-center flex-1 overflow-y-hidden self-center">
            <Drawer drawerIcon={<FaTools />} iconList={[<FaSearch key="search" />, <FaChartBar key="stats" />]}>
                <BuilderCardSearch waiting={waiting} />
                <DeckStats stats={stats} />
            </Drawer>
            {cards && legal &&
                <BuilderDeckInfo updateDeck={updateDeck} setShowImgSelector={setShowImgSelector} />
            }
            {(deckError.show || saving) &&
                <div className="absolute top-0 left-0 w-full h-full bg-[#000a] flex items-center justify-center z-200">
                    {deckError.show &&
                    <div className="w-full max-w-[400px] rounded text-xl p-8 bg-background-1">
                        <div className="flex justify-between items-center">
                            <strong>Error:</strong>
                            <button className="cursor-pointer opacity-60 hover:opacity-100" onClick={closeDeckError}>
                                <FaTimes className="rotate-45" />
                            </button>
                        </div>
                        <br /><br />
                        {deckError.message}
                    </div>
                    }
                    {saving &&
                    <div className="flex flex-col w-full gap-4 items-center justify-center rounded text-3xl p-8 uppercase font-bold opacity-80">
                        <FaSpinner className="text-5xl animate-spin" />
                        {"saving deck..."}
                    </div>
                    }
                </div>
            }
            {showImgSelector && <BuilderImageSelector setShowImgSelector={setShowImgSelector} />}
        </main>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}