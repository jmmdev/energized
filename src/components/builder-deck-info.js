import Image from "next/image";
import { FaArrowAltCircleLeft, FaArrowAltCircleUp, FaGripHorizontal, FaList, FaPen } from "react-icons/fa";
import BuilderDeckResume from "./builder-deck-resume";
import Button from "./button";
import DeckCardGridElement from "./deck-card-grid-element";
import DeckCardListElement from "./deck-card-list-element";
import Footer from "./footer";
import { useDeckContext } from "@/context/deck-context";
import BuilderDeckTopButton from "./builder-deck-top-button";
import { useState } from "react";

export default function BuilderDeckInfo({showSearch, updateDeck, setShowImgSelector}) {
    
    const {
        name, setName, cards, setCards, image, setImage,legal, setLegal,
        hasChanges, setHasChanges, cardQuantity, deckError, closeDeckError
    } = useDeckContext();

    const [display, setDisplay] = useState("list");

    const GetCards = () => {
        if (cardQuantity > 0) {
            if (display === "grid")
                return (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-background-1 p-8 rounded-lg">
                        {
                            cards.map((elem) => {
                                return <DeckCardGridElement key={elem.card.id} elem={elem} />
                            })
                        }
                    </div>
                )
            if (display === "list")
                return (
                    <div className="flex flex-col p-0.5 gap-0.5 bg-background-2">
                        {
                            cards.map((elem) => {
                                return <DeckCardListElement key={elem.card.id} elem={elem} />
                            })
                        }
                    </div>
                )
            }
        
        return (
            <div className="flex flex-col lg:flex-row flex-1 items-center justify-center opacity-40 gap-2">
                <FaArrowAltCircleUp className="animate-bounce lg:hidden text-3xl lg:text-4xl xl:text-5xl" />
                <FaArrowAltCircleLeft className="animate-slide hidden lg:block text-3xl lg:text-4xl xl:text-5xl" />
                <p className="text-2xl sm:text-3xl xl:text-4xl">Search and add cards to your deck</p>
            </div>
        )
    }

    return (
        <section className={`${showSearch ? "h-0 overflow-y-hidden" : "flex-1 overflow-y-auto"}`}>
            <div className="w-full flex flex-col min-h-full px-8 lg:px-12 gap-2">
                <div className="w-full flex flex-col sm:flex-row gap-4 justify-between pt-8">
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
                    <Button color="blue" content="Save" style="h-fit px-[20px_!important]" onClick={updateDeck} disabled={!hasChanges} />
                </div>
                <div className="w-full flex justify-between items-center">
                    <p className="font-bold text-lg my-1">{`${cardQuantity}/60 cards`}</p>
                    {cardQuantity > 0 &&
                        <div className="flex gap-2">
                            <BuilderDeckTopButton content={<FaList />} onClick={() => setDisplay("list")} selected={display === "list"} />
                            <BuilderDeckTopButton content={<FaGripHorizontal />} onClick={() => setDisplay("grid")} selected={display === "grid"} />
                        </div>
                    }
                </div>
                <div className={`${cards.length <= 0 ? "flex" : ""} flex-1 text-center`}>
                    <GetCards />
                </div>
                <div className="mt-auto">
                    <Footer />
                </div>
            </div>
        </section>
    )
}