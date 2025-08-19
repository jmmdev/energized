import Image from "next/image";
import { FaArrowAltCircleLeft, FaArrowAltCircleUp, FaGripHorizontal, FaList, FaPen, FaRegTrashAlt, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import BuilderDeckResume from "./builder-deck-resume";
import Button from "./button";
import DeckCardGridElement from "./deck-card-grid-element";
import DeckCardListElement from "./deck-card-list-element";
import Footer from "./footer";
import { useDeckContext } from "@/context/deck-context";
import BuilderDeckTopButton from "./builder-deck-top-button";
import { useEffect, useRef, useState } from "react";

export default function BuilderDeckInfo({updateDeck, setShowImgSelector}) {
    
    const {
        name, cards, setCards, image, hasChanges, cardQuantity, waiting
    } = useDeckContext();

    const [display, setDisplay] = useState("grid");
    const [sorted, setSorted] = useState(true);

    const firstSort = useRef(true);
    const lastCardsLength = useRef();
    const gridRef = useRef();

    const handleResize = () => {
        const width = window.innerWidth;
        const numColumns = Math.max(2, Math.floor(width / 250));
        
        if (gridRef.current) {
            gridRef.current.style.gridTemplateColumns = `repeat(${numColumns}, auto)`;
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [])

    useEffect(() => {
        if (gridRef.current) {
            handleResize();
        }
    }, [gridRef.current])

    useEffect(() => {
        if (display === "grid" && gridRef.current)
            handleResize();
    }, [display])

    useEffect(() => {
        if (firstSort.current) {
            sortCards();
            firstSort.current = false;
        }
    }, [cards])

    useEffect(() => {
        if (sorted && cards.length > lastCardsLength.current)
            setSorted(false);
        
        lastCardsLength.current = cards.length;
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

        setCards(sorted);
        setSorted(true);
    }

    const handleSave = () => {
        sortCards();
        updateDeck();
    }

    const doClear = () => {
        if (confirm(`${cardQuantity} cards will be removed from ${name}. Are you sure?`))
            setCards([]);
    }

    return (
        <section className="flex-1 overflow-y-auto lg:flex-1">
            <div className="w-full flex flex-col min-h-full px-4 md:px-8 xl:px-12 gap-2">
                <div className="w-full flex flex-col sm:flex-row gap-4 justify-between pt-16 lg:pt-8">
                    <div className="flex items-center gap-6">
                        <div className="group w-16 flex relative justify-center h-full rounded-lg aspect-square cursor-pointer" onClick={() => setShowImgSelector(true)}>
                            <Image className="w-full h-auto rounded-lg object-cover" width={2000} height={2000} alt="Deck image" src={image || `/assets/images/deck-logo-0.png`} />
                            <div className="rounded-full flex items-center justify-center absolute right-0 top-0 p-1.5 -translate-y-1/2 translate-x-1/2 bg-foreground group-hover:bg-blue-500">
                                <FaPen className="text-xs text-background group-hover:text-my-white"/>
                            </div>
                        </div>
                        <div>
                            <BuilderDeckResume />
                        </div>
                    </div>
                    <Button color="blue" content="Save" style="h-fit px-5 py-1 rounded-xs font-bold text-my-white" onClick={handleSave} disabled={!hasChanges} />
                </div>
                <div className="w-full flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <p className="font-bold text-lg">{`${cardQuantity}/60 cards`}</p>
                        {cardQuantity > 0 && !sorted && <BuilderDeckTopButton content={
                            <div className="flex gap-1 items-center">
                                <FaArrowsRotate className="text-base" />
                                <p className="text-base">Sort</p>
                            </div>
                        } style="animate-highlight" onClick={() => sortCards()} />}
                        {cardQuantity > 0 && <BuilderDeckTopButton content={
                            <div className="group flex gap-1 items-center">
                                <FaTrashAlt className="group-hover:hidden text-base" />
                                <FaRegTrashAlt className="hidden group-hover:block text-base" />
                                <p className="text-base">Clear</p>
                            </div>
                        } selected style="hover:text-red-400" onClick={() => doClear()} />}
                    </div>
                    {cardQuantity > 0 &&
                        <div className="flex gap-2">
                            <BuilderDeckTopButton content={<FaGripHorizontal />} onClick={() => setDisplay("grid")} selected={display === "grid"} />
                            <BuilderDeckTopButton content={<FaList />} onClick={() => setDisplay("list")} selected={display === "list"} />
                        </div>
                    }
                </div>
                <div className={`${cards.length <= 0 ? "flex" : ""} flex-1 text-center`}>
                    {
                    cardQuantity > 0
                    ?
                        <>
                        {
                        display === "grid"
                        ?
                            <div ref={gridRef} className="grid gap-6 bg-background-1 p-4 sm:p-8 rounded-3xl xs:rounded-xl sm:rounded-lg">
                            {
                                cards.map((elem) => {
                                    return <DeckCardGridElement key={"grid"+elem.card.id} elem={elem} />
                                })
                            }
                            </div>
                        :
                            <>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-1">
                            {
                                cards.map((elem) => {
                                    return <DeckCardListElement key={"list"+elem.card.id} elem={elem} />
                                })
                            }
                            </div>
                            {waiting && 
                                <div className="flex justify-center p-4">
                                    <FaSpinner className="text-3xl lg:text-2xl animate-spin" />
                                </div>
                            }
                            </>
                        }
                        </>
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