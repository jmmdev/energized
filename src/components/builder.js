"use client";
import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaInfoCircle, FaPen, FaPlus } from "react-icons/fa";
import Button from "./button";
import BuilderCardSearch from "./builder-card-search";
import BuilderImageSelector from "./builder-image-selector";
import { useDeckContext } from "@/context/deck-context";
import DeckCardElement from "./deck-card-element";
import Footer from "./footer";
import BuilderDeckResume from "./builder-deck-resume";

export default function Builder({isNew, deckId}) {
    const router = useRouter();
    const {data: session, status} = useSession();

    const {
        name, setName, cards, setCards, image, setImage,legal, setLegal,
        hasChanges, setHasChanges, cardQuantity, deckError, closeDeckError
    } = useDeckContext();

    const [showImgSelector, setShowImgSelector] = useState(false);
    const [showImgMsg, setShowImgMsg] = useState(false);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showCardSearch, setShowCardSearch] = useState(true);

    const errorRef = useRef(null);

    useEffect(() => {
        const initialize = async () => {
            const response = await axios.get(`http://localhost:3500/api/decks/${deckId}`);
            const deck = response.data;

            if (deck) {
                setName(deck.name);
                setCards(deck.cards);
                setImage(deck.image);
                setLegal(deck.legal);
            }
            else
                router.replace("/");
        }

        console.log(session?.user);

        if (isNew)
            createDeck();
        else
            initialize();
        
    }, [isNew, deckId]);

    useEffect(() => {
        if (showImgMsg) {
            setTimeout(() => {
                setShowImgMsg(false);
            }, 3000);
        }
    }, [showImgMsg])

    useEffect(() => {
        if (!hasChanges && saving)
            setSaving(false);
    }, [hasChanges])

    const editImage = () => {
        if (cards.length > 0)
            setShowImgSelector(true);
        else
            setShowImgMsg(true);
    }

    useEffect(() => {
        let timeout;
        if (errorRef.current) {
            
            clearTimeout(timeout);
            
            if (deckError.show) {

                timeout = setTimeout(() => {
                    errorRef.current.style.opacity = 0;
                }, 1500);

                timeout = setTimeout(() => {
                    closeDeckError();
                }, 1900);
            }
        }
    }, [deckError.show])

    useEffect(() => {
        const doSave = async () => {
            await axios.post(`http://localhost:3500/api/decks/${deckId}`, {
                data: {
                    name, cards, image, legal
                }
            });
            setSaving(false);
            setHasChanges(false);
        }
        if (saving)
            doSave();
    }, [saving])

    const sortCards = () => {
        const sorted = [...cards];
        
        sorted.sort((a, b) => {
            const cardA = a.card;
            const cardB = b.card;

            if (cardA.category === cardB.category) {
                compareCards(cardA, cardB);
            }

            if (cardA.category === "Pokemon")
                return -1;

            if (cardA.category === "Trainer") {
                if (cardB.category === "Energy")
                    return -1;
                
                return 1;
            }

            if (cardA.category === "Energy")
                return 1;
        });

        setCards(sorted);
    }

    const createDeck = async () => {
        const response = await axios.post("http://localhost:3500/api/decks", {
            data: {
                creator: {
                    id: session.user?.id,
                    name: session.user?.name
                },
                name, cards, image, legal
            }
        });
        
        router.replace(`/build/${response.data._id}`)
    }

    const updateDeck = async () => {
        setSaving(true);
    }

    if (isNew || status === "loading")
        return null;

    if (!session || !session.user)
        return <LoginForm onLoginSuccess={refreshSession} />

    return (
        <>
        <main className="relative flex flex-col lg:flex-row min-h-full lg:h-full bg-background">
            <BuilderCardSearch />
            <section className="flex-1 flex justify-center p-4">
                <div className="w-full max-w-[1200px] flex flex-col min-h-1/2 lg:h-auto lg:flex-[1] gap-1 p-2 lg:px-12 lg:py-8 overflow-y-auto">
                    <div className="w-full flex justify-between">
                        <div className="flex items-center gap-6">
                            <div className="group flex relative justify-center h-full rounded-lg aspect-square cursor-pointer" onClick={editImage}>
                                <Image className="rounded-lg object-cover" alt="Deck image" fill sizes="2000" src={`/assets/images/user-dark.png`} />
                                <div className="rounded-full flex items-center justify-center absolute right-0 top-0 p-1.5 -translate-y-1/2 translate-x-1/2 bg-foreground group-hover:bg-blue-500">
                                    <FaPen className="text-xs text-background group-hover:text-my-white"/>
                                </div>
                            </div>
                            <div>
                                <BuilderDeckResume />
                            </div>
                        </div>
                        <div className="h-full flex flex-col items-end justify-between">
                            <Button color="blue" content="Save" onClick={updateDeck} disabled={!hasChanges} />
                            <p>Card count: {cardQuantity}</p>
                        </div>
                    </div>
                    <div className={`flex text-neutral-400 gap-1 items-center transition-opacity ${showImgMsg ? "opacity-100" : "opacity-0"}`}>
                        <FaInfoCircle />
                        <p>Add cards to your deck to select a cover card</p>
                    </div>
                    {
                    cards.length > 0 ?
                    <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                        {
                            cards.map((elem) => {
                                return <DeckCardElement key={elem.card.id} elem={elem} />
                            })
                        }
                    </div>
                    :
                        <p>{"<- Start adding cards to your deck"}</p>
                    }
                    <div className="mt-auto">
                        <Footer />
                    </div>
                </div>
            </section>
            {deckError.show &&
            <div ref={errorRef} className="absolute top-1/2 left-1/2 -translate-1/2 rounded text-xl p-8 bg-background-2 opacity-0 transition-opacity z-0">
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
        </main>
        {showImgSelector && <BuilderImageSelector setShowImgSelector={setShowImgSelector} />}
        </>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
}

const compareCards = (a, b) => {
    const category = a.category;

    switch (category) {
        case "Pokemon":
            return comparePokemon(a, b);
        
        case "Trainer":
            return compareTrainers(a, b);
        
        case "Energy":
            return compareEnergies(a, b);
    }
}

const TYPES = ["Grass", "Fire", "Water", "Lightning", "Psychic", "Fighting", "Dark", "Steel", "Dragon", "Colorless"];

const comparePokemon = (a, b) => {
    const STAGES = ["Basic", "Stage1", "Stage2"];

    const compareStages = STAGES.indexOf(a.stage) - TYPES.indexOf(b.stage);
    
    if (compareStages !== 0)
        return compareStages;
    
    const compareTypes = TYPES.indexOf(a.types[0]) - TYPES.indexOf(b.types[1]);

    if (compareTypes !== 0)
        return compareTypes;

    return a.name.localeCompare(b.name);
}

const compareTrainers = (a, b) => {
    const TRAINER_TYPES = ["Supporter", "Item", "Stadium"];
    
    const compareTrainerTypes = TRAINER_TYPES.indexOf(a.trainerType) - TRAINER_TYPES.indexOf(b.trainerType);

    if (compareTrainerTypes !== 0)
        return compareTrainerTypes;

    return a.name.localeCompare(b.name);
    
}

const compareEnergies = (a, b) => {
    const ENERGY_TYPES = ["Normal", "Special"];

    const compareEnergyTypes = ENERGY_TYPES.indexOf(a.energyType) - ENERGY_TYPES.indexOf(b.energyType);

    if (compareEnergyTypes !== 0)
        return compareEnergyTypes

    const compareTypes = TYPES.indexOf(a.types[0]) - TYPES.indexOf(b.types[0]);

    return compareTypes;

}