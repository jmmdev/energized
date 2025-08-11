import { useDeckContext } from "@/context/deck-context";
import { useEffect, useState } from "react";

export default function DeckCardListElement({elem}) {
    const {
        countCardsWithName, cardHasLimit, addCard, removeCard, cardQuantity
    } = useDeckContext();

    const [disableAdd, setDisableAdd] = useState(false);

    useEffect(() => {
        setDisableAdd((cardHasLimit(elem.card.name) && countCardsWithName(elem.card.name) >= 4) || cardQuantity >= 60);
    }, [elem])

    const handleLeftClick = () => {
        if (!disableAdd)
            addCard(elem.card);
    }

    const handleRightClick = (e) => {
        e.preventDefault();
        removeCard(elem.card);
        return false;
    }
 
    return (
        <div className="w-full select-none cursor-pointer hover:ring-2" onClick={handleLeftClick} onContextMenu={handleRightClick}>
            <p className="w-full text-left bg-background-1 text-foreground px-4 py-1 font-bold">
                {elem.card.name} x{elem.quantity} 
            </p>
        </div>
    )
}