import Image from "next/image";
import { FaArrowAltCircleLeft, FaArrowAltCircleUp, FaGripHorizontal, FaInfoCircle, FaList, FaPen, FaSearch } from "react-icons/fa";
import BuilderDeckResume from "./builder-deck-resume";
import Button from "./button";
import DeckCardElement from "./deck-card-element";
import Footer from "./footer";
import { useEffect, useState } from "react";
import { useDeckContext } from "@/context/deck-context";

export default function BuilderDeckInfo({showSearch, updateDeck, setShowImgSelector}) {
    
    const {
        name, setName, cards, setCards, image, setImage,legal, setLegal,
        hasChanges, setHasChanges, cardQuantity, deckError, closeDeckError
    } = useDeckContext();

    const [numColumns, setNumColumns] = useState(0);

    useEffect(() => {
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth >= 1024 ? 350 : 200;
            setNumColumns(Math.max(3, Math.floor(window.innerWidth / width)));
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])
    

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
                    <p className="text-right mb-1">{`${cardQuantity} card${cardQuantity !== 1 ? "s" : ""}`}</p>
                    <div className="flex gap-2">
                        {/* 2 BUILDER DECK TOP BUTTON */}
                    </div>
                </div>
                <div className={`${cards.length <= 0 && "flex"} flex-1 rounded bg-background-1 p-8 text-center`}>
                    {
                    cards.length > 0 ?
                    <div className="grid gap-4" style={{gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`}}>
                        {
                            cards.map((elem) => {
                                return <DeckCardElement key={elem.card.id} elem={elem} />
                            })
                        }
                    </div>
                    :
                        <div className="flex flex-col lg:flex-row flex-1 items-center justify-center opacity-40 text-2xl lg:text-3xl xl:text-4xl gap-2">
                            <FaArrowAltCircleUp className="lg:hidden text-3xl lg:text-4xl xl:text-5xl" />
                            <FaArrowAltCircleLeft className="hidden lg:block text-3xl lg:text-4xl xl:text-5xl" />
                            <p>Search and add cards to your deck</p>
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