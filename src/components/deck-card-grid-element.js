import { useDeckContext } from "@/context/deck-context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaSpinner } from "react-icons/fa";
import Button from "./button";

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
            <div className="flex flex-col items-center gap-3">
                <div className={`relative flex flex-col select-none`}>
                    <Image className={`object-contain ${!loaded && "opacity-0"}`} priority src={elem.card.image + "/high.webp"}
                    width={2000} height={2000} alt={`${elem.card.name}#${elem.card.id}`} onLoad={handleLoad} />
                    {!loaded &&
                    <div className="absolute top-0 w-full h-full rounded-lg border-4 flex items-center justify-center">
                        <FaSpinner className="text-3xl animate-spin" />
                    </div>
                    }
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
        )
}