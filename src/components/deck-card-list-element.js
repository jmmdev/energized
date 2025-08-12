import { useDeckContext } from "@/context/deck-context";
import { useEffect, useState } from "react";

export default function DeckCardListElement({elem}) {
    const {
        countCardsWithName, cardHasLimit, addCard, removeCard, cardQuantity, deckHasRadiant
    } = useDeckContext();

    const TYPES = require("public/assets/files/energy-types.json");
    const COLORS = require("public/assets/files/list-colors.json");

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

    const handleLeftClick = () => {
        if (!disableAdd)
            addCard(elem.card);
    }

    const handleRightClick = (e) => {
        e.preventDefault();
        removeCard(elem.card);
        return false;
    }

    const getBg = () => {
        if (elem.card.types) {
            
            const typeIndex = TYPES.findIndex((obj) => obj.toLowerCase() === elem.card.types[0]?.toLowerCase());
            const bgColor = COLORS[typeIndex];
            
            return bgColor;
        }
        return null;
    }
 
    return (
        <div className={`group w-full select-none cursor-pointer ${getBg() || "bg-background-1"}`} onClick={handleLeftClick} onContextMenu={handleRightClick}>
            <p className="w-full text-left text-my-black px-4 py-1 font-bold group-hover:bg-[#fff4]">
                {elem.card.name} x{elem.quantity} 
            </p>
        </div>
    )
}