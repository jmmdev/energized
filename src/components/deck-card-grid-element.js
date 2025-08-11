import { useDeckContext } from "@/context/deck-context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function DeckCardGridElement({elem}) {
    const {
        countCardsWithName, cardHasLimit, addCard, removeCard, cardQuantity
    } = useDeckContext();

    const [loaded, setLoaded] = useState(false);
    const [disableAdd, setDisableAdd] = useState(false);

    useEffect(() => {
        const newDisableValue = (cardHasLimit(elem.card.name) && countCardsWithName(elem.card.name) >= 4) || cardQuantity >= 60; 
        
        if (newDisableValue !== disableAdd)
            setDisableAdd(newDisableValue);
    }, [cardQuantity])

    const handleLeftClick = (e) => {
        if (!disableAdd)
            addCard(elem.card);
    }

    const handleRightClick = (e) => {
        e.preventDefault();
        removeCard(elem.card);
        return false;
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
            <div className="w-full relative flex items-end select-none cursor-pointer hover:ring-4" onClick={handleLeftClick} onContextMenu={handleRightClick}>
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
            </div>
        )
}