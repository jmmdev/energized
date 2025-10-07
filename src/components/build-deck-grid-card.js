import { useDeckContext } from "@/context/deck-context";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import Button from "./button";
import GridCardImage from "./grid-card-image";

export default function BuildDeckGridCard({elem, setZoomIn, zoomRef}) {
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
 
    return (
        <div className="flex flex-col items-center gap-3">
            <GridCardImage elem={elem} loaded={loaded} setLoaded={setLoaded} zoomRef={zoomRef} setZoomIn={setZoomIn}  />
            {loaded &&
            <div className="flex items-center gap-3 text-my-white">
                <Button color="red" content={<FaMinus />} style="p-2 rounded" onClick={doRemove} />
                <p className="text-4xl text-foreground font-bold">
                    x {elem.quantity}  
                </p>
                <Button color="green" content={<FaPlus />} style="p-2 rounded" onClick={doAdd} disabled={disableAdd} />
            </div> 
            }
        </div>
    )
}