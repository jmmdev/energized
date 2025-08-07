"use client";
import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import BuilderCardSearch from "./builder-card-search";
import BuilderImageSelector from "./builder-image-selector";
import { useDeckContext } from "@/context/deck-context";
import BuilderDeckInfo from "./builder-deck-info";

export default function Builder({isNew, deckId}) {
    const router = useRouter();
    const {data: session, status} = useSession();

    const {
        name, setName, cards, setCards, image, setImage,legal, setLegal,
        hasChanges, setHasChanges, cardQuantity, deckError, closeDeckError,
        createDeck, initializeDeck
    } = useDeckContext();

    const [showImgSelector, setShowImgSelector] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const errorRef = useRef(null);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
                console.log("aa t baniaste XD");
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasChanges]);

    useEffect(() => {
        if (isNew) {
            createDeck();
            router.replace(`/build/${response.data._id}`);
        }
        else {
            try {
                initializeDeck(deckId);
            } 
            catch (e) {
                router.replace("/");
            }
        }
    }, []);

    useEffect(() => {
        if (!hasChanges && saving)
            setSaving(false);
    }, [hasChanges])

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

    const updateDeck = async () => {
        setSaving(true);
    }

    if (isNew || status === "loading")
        return null;

    if (!session || !session.user)
        return <LoginForm onLoginSuccess={refreshSession} />

    return (
        <>
        <main className="relative flex flex-col lg:flex-row min-h-full lg:h-full bg-background overflow-y-hidden">
            <BuilderCardSearch showSearch={showSearch} setShowSearch={setShowSearch} />
            {name && cards && legal &&
            <BuilderDeckInfo showSearch={showSearch} updateDeck={updateDeck} setShowImgSelector={setShowImgSelector} />
            }
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