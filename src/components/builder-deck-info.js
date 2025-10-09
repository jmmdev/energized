import Image from "next/image";
import { FaArrowAltCircleLeft, FaArrowAltCircleUp, FaGripHorizontal, FaInfoCircle, FaList, FaPen, FaRegTrashAlt, FaSpinner, FaTrashAlt } from "react-icons/fa";
import BuilderDeckResume from "./builder-deck-resume";
import Button from "./button";
import Footer from "./footer";
import { useDeckContext } from "@/context/deck-context";
import BuilderDeckTopButton from "./builder-deck-top-button";
import { useEffect, useRef, useState } from "react";
import CardDisplay from "./card-display";

export default function BuilderDeckInfo({updateDeck, setShowImgSelector}) {
    
    const {
        name, cards, setCards, image, hasChanges, setHasChanges, cardQuantity, visible, setVisible
    } = useDeckContext();

    const [display, setDisplay] = useState("grid");

    const lastCardsLength = useRef(cards.length);

    useEffect(() => {
        if (cards.length > lastCardsLength.current) {
            sortCards();
        }
        else {
            lastCardsLength.current = cards.length;
        }
    }, [cards.length])

    const sortCards = () => {
        const sorted = [...cards];
        
        sorted.sort((a, b) => {
            const cardA = a.card;
            const cardB = b.card;

            if (cardA.category === cardB.category) {
                return compareCards(cardA, cardB);
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

        lastCardsLength.current = cards.length;
        setCards(sorted);
    }

    const handleSave = () => {
        sortCards();
        updateDeck();
    }

    const switchVisible = () => {
        setVisible(!visible);
        setHasChanges(true);
    }

    const doClear = () => {
        if (confirm(`${cardQuantity} cards will be removed from ${name}. Are you sure?`))
            setCards([]);
    }

    return (
        <section className="w-full flex justify-center overflow-y-auto builder-scrollbar mb-13 lg:mb-0">
            <div className="w-full flex flex-col min-h-full px-4 md:px-8 gap-4 lg:max-w-[1500px]">
                <div className="w-full flex flex-col sm:flex-row gap-4 justify-between pt-16 lg:pt-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-6">
                            <button className="group w-16 flex relative justify-center h-full rounded-lg aspect-square cursor-pointer" onClick={() => setShowImgSelector(true)}>
                                <Image className="w-full h-auto rounded-lg object-cover" width={2000} height={2000} alt="Deck image" src={image || `/assets/images/deck-logo-0.png`} />
                                <div className="rounded-full flex items-center justify-center absolute right-0 top-0 p-1.5 -translate-y-1/2 translate-x-1/2 bg-foreground group-hover:bg-blue-500">
                                    <FaPen className="text-xs text-background group-hover:text-my-white"/>
                                </div>
                            </button>
                            <div>
                                <BuilderDeckResume />
                            </div>
                        </div>
                    </div>
                    <Button color="blue" content="Save" style="hidden sm:block h-fit px-5 py-1 rounded-xs font-bold text-my-white" onClick={handleSave} disabled={!hasChanges} />
                </div>
                <div className="w-full flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-2 sm:gap-4">
                        <div className="flex gap-4 items-center">
                            <div className="flex gap-1 items-center">
                                <p className="font-bold text-xl">
                                    {`${cardQuantity}/60 cards`}
                                </p>
                            </div>
                            <button className={`group uppercase rounded-full bg-background-2 p-1 ${cardQuantity !== 60 ? "opacity-70 cursor-default" : "cursor-pointer"}`}
                            onClick={switchVisible} disabled={cardQuantity !== 60}>
                                <div className="group relative flex font-semibold">
                                    <div className="w-1/2 rounded-full px-3 py-1">
                                        Public
                                    </div>
                                    <div className="w-1/2 rounded-full px-3 py-1">
                                        Private
                                    </div>
                                    <div className={`absolute w-1/2 h-full flex justify-center items-center rounded-full px-3 py-1 transition-all text-my-white 
                                        ${visible ? "bg-emerald-500 group-hover:bg-emerald-400 translate-x-0" : "bg-red-500 group-hover:bg-red-400 translate-x-full"}`}>
                                        {visible ? "Public" : "Private"}
                                    </div>
                                </div>
                            </button>
                        </div>
                        {cardQuantity !== 60 &&
                        <div className="w-max gap-2 text-red-400">
                            <p>Decks under 60 cards are <span className="font-bold uppercase">always</span> hidden.</p>
                        </div>
                        }
                    </div>
                    <Button color="blue" content="Save" style="sm:hidden w-full h-fit px-5 py-1 rounded-xs font-bold text-my-white" onClick={handleSave} disabled={!hasChanges} />
                    {cardQuantity > 0 &&
                        <div className="flex gap-2 items-center self-end">
                            <BuilderDeckTopButton content={
                                <div className="group flex gap-1 items-center">
                                    <FaTrashAlt className="group-hover:hidden text-base" />
                                    <FaRegTrashAlt className="hidden group-hover:block text-base" />
                                    <p className="text-base underline">Clear</p>
                                </div>
                            } selected style="hover:text-red-400" onClick={() => doClear()} />
                            <BuilderDeckTopButton content={<FaGripHorizontal />} onClick={() => setDisplay("grid")} selected={display === "grid"} />
                            <BuilderDeckTopButton content={<FaList />} onClick={() => setDisplay("list")} selected={display === "list"} />
                        </div>
                    }
                </div>
                <div className={`flex ${cards.length <= 0 ? "flex-row" : "flex-col"} flex-1 text-center my-4`}>
                    {
                    cardQuantity > 0
                    ?
                        <CardDisplay cards={cards} display={display} editable />
                    :
                        <div className="flex flex-col lg:flex-row flex-1 items-center justify-center opacity-40 gap-2">
                            <FaArrowAltCircleUp className="animate-bounce lg:hidden text-3xl lg:text-4xl xl:text-5xl" />
                            <FaArrowAltCircleLeft className="animate-slide hidden lg:block text-3xl lg:text-4xl xl:text-5xl" />
                            <p className="text-2xl sm:text-3xl xl:text-4xl">Search and add cards to your deck</p>
                        </div>
                    }
                </div>
                <div className="mt-auto">
                    <Footer />
                </div>
            </div>
        </section>
    )
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

const TYPES = require("public/assets/files/energy-types.json");

const comparePokemon = (a, b) => {
    const STAGES = ["Basic", "Stage1", "Stage2"];

    const stageA = STAGES.indexOf(a.stage);
    const stageB = STAGES.indexOf(b.stage);
    
    if (stageA >= 0 && stageB < 0)
        return -1;

    if (stageA < 0 && stageB >= 0)
        return 1;

    const compareStages = stageA - stageB;
    
    if (compareStages !== 0)
        return compareStages;
    
    if (a.types && b.types) {
        const compareTypes = TYPES.indexOf(a.types[0]) - TYPES.indexOf(b.types[0]);

        if (compareTypes !== 0)
            return compareTypes;
    }

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

    if (a.types && b.types) {
        const compareTypes = TYPES.indexOf(a.types[0]) - TYPES.indexOf(b.types[0]);
        return compareTypes;
    }

    return a.name.localeCompare(b.name);
}