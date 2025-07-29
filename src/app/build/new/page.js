"use client";
import LoginForm from "@/components/login-form";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaInfoCircle, FaPen } from "react-icons/fa";

export default function Build({deck}) {
    const router = useRouter();
    const {data: session, status} = useSession();

    const [name, setName] = useState(deck?.name || "Unnamed Deck");
    const [cards, setCards] = useState(deck?.cards || []);
    const [image, setImage] = useState(deck?.image || "default");
    const [legal, setLegal] = useState(deck?.legal || {
        standard: true,
        expanded: true
    });

    const [showImgSelector, setShowImgSelector] = useState(false);
    const [showImgMsg, setShowImgMsg] = useState(false);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [saved, setSaved] = useState(false);

    const oldCardsLength = useRef(cards.length);
    const cardQuantityRef = useRef(0);

    useEffect(() => {
        if (showImgMsg) {
            setTimeout(() => {
                setShowImgMsg(false);
            }, 3000);
        }
    }, [showImgMsg])

    useEffect(() => {
        checkLegality();
    }, [cards])

    const editImage = () => {
        if (cards.length > 0)
            setShowImgSelector(true);
        else
            setShowImgMsg(true);
    }

    const checkLegality = () => {
        let stLegal = true;
        let exLegal = true;

        let cardQuantity = 0;

        for (let c of cards) {
            stLegal &= c.card.legal.standard;
            exLegal &= c.card.legal.expanded;

            cardQuantity += c.quantity;
        }

        cardQuantityRef.current = cardQuantity;

        setLegal({
            standard: stLegal,
            expanded: exLegal,
        })
    }

    const addCard = (card) => {
        const newCards = [...cards];

        const sameNameCards = newCards.filter((elem) => elem.card.name === card.name);
        let cardQuantity = 0;

        for (let snc of sameNameCards) {
            cardQuantity += snc.quantity;
        }

        if (cardQuantity < 4) {

            const oldCardObject = newCards.find((elem) => elem.card.id === card.id);

            if (oldCardObject) {
                newCards[cardPosition] = {
                    card,
                    quantity: oldCardObject.quantity + 1,
                }
            }
            else {
                newCards.push({
                    card,
                    quantity: 1,
                })
            }
        }

        else {
            //Error
            setShowErrorMsg(true);
        }

        setCards(newCards);
    }

    const removeCard = (card) => {
        const newCards = [...cards];

        const oldCardObjectIndex = newCards.findIndex((elem) => elem.id === card.id);
        const oldCardObject = oldCardObjectIndex >= 0 ? cards[oldCardObjectIndex] : null;

        if (oldCardObject) {
            if (oldCardObject.quantity > 1){
                newCards[cardPosition] = {
                    card,
                    quantity: oldCardObject.quantity - 1,
                }
            }
            else {
                newCards.splice(oldCardObjectIndex, 1);
            }
            setCards(newCards);
        }
        else {
            //Error
            setShowErrorMsg(true);
        }
    }

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

    if (status === "loading")
        return null;

    if (!session || !session.user)
        return <LoginForm onLoginSuccess={refreshSession} />

    return (
        <>
            <main className="flex">
                <div className="flex-auto flex flex-col gap-2">
                    <div className="flex gap-1 p-4 bg-background-1">
                        <div className="group flex relative justify-center w-13 aspect-square cursor-pointer" onClick={editImage}>
                            <Image className="rounded-lg object-cover" alt="Deck image" fill sizes="2000" src={`/assets/images/user-dark.png`} />
                            <div className="hidden rounded-lg group-hover:flex items-center justify-center absolute w-full h-full bg-[#0008]">
                                <FaPen className="text-2xl"/>
                            </div>
                        </div>
                        <div className="w-full flex flex-col">
                            <input className="w-full max-w-sm text-2xl bg-transparent text-foreground rounded border border-background hover:border-neutral-500" 
                            value={name} onChange={(e) => setName(e.target.value)}/>
                            <p className="px-1.5">
                                Standard: {cardQuantityRef.current !== 60 ? "N/A" : <span className={legal.standard ? "text-emerald-400" : "text-red-400"}>{legal.standard ? "Legal" : "Illegal"}</span>}
                                {", "}
                                Expanded: {cardQuantityRef.current !== 60 ? "N/A" : <span className={legal.expanded ? "text-emerald-400" : "text-red-400"}>{legal.expanded ? "Legal" : "Illegal"}</span>}
                            </p>
                        </div>
                    </div>
                    <div className={`flex text-sm text-neutral-400 gap-1 items-center transition-opacity ${showImgMsg ? "opacity-100" : "opacity-0"}`}>
                        <FaInfoCircle />
                        <p>Add cards to your deck to select a cover card</p>
                    </div>
                </div>
                {
                //<DeckBuilder  />
                }
            </main>
            <aside className="relative h-full h-screen fixed top-0 left-0 bg-background-2">
                <div className="flex flex-col gap-4 absolute top-0 left-0 text-foreground p-4" onClick={(e) => e.stopPropagation()}>
                    
                </div>
            </aside>
        </>
    )
}

async function refreshSession() {
  await getSession({ triggerEvent: true });
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
    router.replace(`/build/${response.data.id}`);
}

const updateDeck = async () => {
    const response = await axios.post(`http://localhost:3500/api/decks/${deck.id}`, {
        data: {
            name, cards, image, legal
        }
    });
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