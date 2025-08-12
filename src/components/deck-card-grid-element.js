import { useDeckContext } from "@/context/deck-context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaSpinner } from "react-icons/fa";

export default function DeckCardGridElement({elem}) {
    const {
        countCardsWithName, cardHasLimit, addCard, removeCard, cardQuantity, deckHasRadiant
    } = useDeckContext();

    const [loaded, setLoaded] = useState(false);
    const [disableAdd, setDisableAdd] = useState(false);

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
            <div className={`w-full relative flex flex-col items-end select-none cursor-pointer ${loaded && "hover:opacity-60"}`}>
                <Image className={`object-contain ${!loaded && "opacity-0"}`} priority src={elem.card.image + "/high.webp"}
                width={500} height={500}alt={`${elem.card.name}#${elem.card.id}`} onLoad={handleLoad} />
                <p className="absolute bottom-2 right-2 rounded bg-background-1 text-foreground px-4 py-1 font-bold">
                    x {elem.quantity} 
                </p>
                {!loaded &&
                <div className="absolute top-0 w-full h-full rounded-lg border-4 flex items-center justify-center">
                    <FaSpinner className="text-3xl animate-spin" />
                </div>
                }
                {loaded &&
                <div className="absolute top-0 left-0 w-full h-full flex text-3xl">
                    <div className="w-1/2 h-full flex justify-center items-center bg-red-500 opacity-0 hover:opacity-100"
                    onClick={doRemove}>
                        <FaMinus className="text-red-200" />
                    </div>
                    <div className="w-1/2 h-full flex justify-center items-center bg-emerald-500 opacity-0 hover:opacity-100"
                    onClick={doAdd}>
                        <FaPlus className="text-emerald-200"/>
                    </div>
                </div> 
                }
            </div>
        )
}