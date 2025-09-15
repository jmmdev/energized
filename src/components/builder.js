"use client";
import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaPlus, FaSpinner } from "react-icons/fa";
import BuilderCardSearch from "./builder-card-search";
import BuilderImageSelector from "./builder-image-selector";
import { useDeckContext } from "@/context/deck-context";
import BuilderDeckInfo from "./builder-deck-info";

export default function Builder({isNew, deckId}) {
    const router = useRouter();
    const {data: session, status} = useSession();

    const {
        deckCreatorId, name, cards, cardQuantity, image, legal, hasChanges,
        setHasChanges, deckError, closeDeckError, createDeck, initializeDeck
    } = useDeckContext();

    const [showImgSelector, setShowImgSelector] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            if (isNew) {
                const response = await createDeck();
                router.replace(`/build/${response.data._id}`);
            }
            else {
                try {
                    await initializeDeck(deckId);

                    if (deckCreatorId.current === session.user.id)
                        setLoaded(true);
                    else
                        router.replace("/");
                } 
                catch (e) {
                    router.replace("/");
                }
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
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/decks/${deckId}`, {
                data: {
                    name, cards, image, legal, cardCount: cardQuantity
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

    const updateDeck = async () => {
        setSaving(true);
    }

    if (!loaded)
        return null;

    if (!session || !session.user)
        return <LoginForm onLoginSuccess={refreshSession} />

    return (
        <>
        <main className="relative flex flex-col lg:flex-row-reverse h-full bg-background overflow-y-hidden">
            {cards && legal &&
                <BuilderDeckInfo updateDeck={updateDeck} setShowImgSelector={setShowImgSelector} />
            }
            <BuilderCardSearch />
            {(deckError.show || saving) &&
                <div className="absolute top-0 left-0 w-full h-full bg-[#0008] flex items-center justify-center z-200">
                    {deckError.show &&
                    <div className="w-full max-w-[400px] rounded text-xl p-8 bg-background-1">
                        <div className="flex justify-between items-center">
                            <strong>Error:</strong>
                            <button className="cursor-pointer opacity-60 hover:opacity-100" onClick={closeDeckError}>
                                <FaPlus className="rotate-45" />
                            </button>
                        </div>
                        <br /><br />
                        {deckError.message}
                    </div>
                    }
                    {saving &&
                    <div className="flex flex-col w-full max-w-[400px] gap-4 items-center justify-center rounded text-xl p-8 bg-background-1">
                        <FaSpinner className="text-3xl animate-spin" />
                        {"Saving..."}
                    </div>
                    }
                </div>
            }
        </main>
        {showImgSelector && <BuilderImageSelector setShowImgSelector={setShowImgSelector} />}
        </>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}