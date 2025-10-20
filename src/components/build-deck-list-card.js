import { useDeckContext } from "@/context/deck-context";
import { useEffect, useState } from "react";
import Button from "./button";
import { FaMinus, FaPlus } from "react-icons/fa";
import ListCardImage from "./list-card-image";

export default function BuildDeckListCard({elem, setZoomIn, zoomRef}) {
    const {
        countCardsWithName, cardHasLimit, addCard, removeCard, cardQuantity, deckHasRadiant
    } = useDeckContext();

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
 
    return (
        <ListCardImage elem={elem} setZoomIn={setZoomIn} zoomRef={zoomRef}>
            <button className="flex items-center gap-0.5 text-sm cursor-default" onClick={(e) => e.stopPropagation()}>
                <Button color="dark" className="text-foreground p-1.5 rounded-full border-2" onClick={doRemove}>
                    <FaMinus />
                </Button>
                <p className="text-3xl w-12 font-bold">{elem.quantity}</p>
                <Button color="dark" className="text-foreground p-1.5 rounded-full border-2" onClick={doAdd} disabled={disableAdd}>
                    <FaPlus />
                </Button>
            </button>
        </ListCardImage>
    )
}