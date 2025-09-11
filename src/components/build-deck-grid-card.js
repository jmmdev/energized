import { useDeckContext } from "@/context/deck-context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaSpinner, FaSearchPlus } from "react-icons/fa";
import Button from "./button";

export default function BuildDeckGridCard({elem}) {
    const {
        countCardsWithName, cardHasLimit, addCard, removeCard, cardQuantity, deckHasRadiant
    } = useDeckContext();

    const [loaded, setLoaded] = useState(false);
    const [disableAdd, setDisableAdd] = useState(false);
    const [zoomIn, setZoomIn] = useState(false);

    useEffect(() => {
        if (zoomIn)
            document.body.style.overflow = "hidden";
        else
            document.body.style.overflow = "auto";
    }, [zoomIn])

    useEffect(() => {
        const name_lower = elem.card.name.toLowerCase();

        const newDisableValue = 
        (cardHasLimit(elem.card.name) && countCardsWithName(elem.card.name) >= 4) || 
        name_lower.includes("radiant") && deckHasRadiant() || 
        cardQuantity >= 60;
        
        if (newDisableValue !== disableAdd)
            setDisableAdd(newDisableValue);
    }, [cardQuantity])

    const doAdd = () => {
        if (!disableAdd)
            addCard(elem.card);
    }

    const doRemove = () => {
        removeCard(elem.card);
    }
    
    const handleLoad = () => {
        if (!loaded) {
            let timeout;
            clearTimeout(timeout);
            
            setTimeout(() => {
                setLoaded(true);
            }, 300);
        }
    }
 
        return (
            <>
            <div className="flex flex-col items-center gap-3">
                <div className={`group relative flex flex-col select-none cursor-pointer`} onClick={() => setZoomIn(true)}>
                    <Image className={`object-contain ${!loaded && "opacity-0"}`} priority src={elem.card.image + "/high.webp"}
                    width={2000} height={2000} alt={`${elem.card.name}#${elem.card.id}`} onLoad={handleLoad} />
                    {!loaded &&
                    <div className="absolute top-0 w-full h-full rounded-lg border-4 flex items-center justify-center">
                        <FaSpinner className="text-3xl animate-spin" />
                    </div>
                    }
                    <div className="absolute text-xl -top-2 -right-2 p-2 bg-background-2 rounded-full border-3 border-background-1 group-hover:bg-foreground group-hover:text-highlight transition-all">
                        <FaSearchPlus />
                    </div>
                </div>
                {loaded &&
                <div className="flex items-center gap-3 text-my-white">
                    <Button color="red" content={<FaMinus />} style="p-2 rounded" onClick={doRemove} />
                    <p className="text-2xl text-foreground font-bold">
                        x{elem.quantity} 
                    </p>
                    <Button color="green" content={<FaPlus />} style="p-2 rounded" onClick={doAdd} disabled={disableAdd} />
                </div> 
                }
            </div>
            {zoomIn &&
                <div className="fixed flex flex-col w-full h-full bg-[#000c] z-100 p-8 top-0 left-0">
                    <div className="w-full flex-1 flex flex-col justify-center gap-4">
                        <button className="self-end opacity-60 hover:opacity-100 cursor-pointer text-my-white" onClick={() => setZoomIn(false)}>
                            <FaPlus className="text-3xl rotate-45" />
                        </button>
                        <div className="relative w-full h-full">
                            <img className={`absolute inset-0 w-full h-full object-contain ${!loaded && "opacity-0"}`} src={elem.card.image + "/high.webp"} alt={`${elem.card.name}#${elem.card.id}`} onLoad={handleLoad} />
                        </div>
                    </div>
                </div>
            }
            </>
        )
}