"use client";
import Image from "next/image";
import Button from "./button";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDeckContext } from "@/context/deck-context";

export default function CardSearchListElement({elem, quantity}) {
    const {
        countCardsWithName, cardHasLimit, addCard, removeCard, cardQuantity, deckHasRadiant
    } = useDeckContext();

    const [disableAdd, setDisableAdd] = useState(false);

    useEffect(() => {
        const name_lower = elem.name.toLowerCase();

        const newDisableValue = 
        (cardHasLimit(elem.name) && countCardsWithName(elem.name) >= 4) || 
        name_lower.includes("radiant") && deckHasRadiant() || 
        cardQuantity >= 60;
        
        if (newDisableValue !== disableAdd)
            setDisableAdd(newDisableValue);
    }, [cardQuantity])

    return (
        <div key={elem.id} className="w-full flex flex-col gap-4 lg:gap-2">
            <div className="w-full relative">
                <Image className="object-contain" priority src={elem.image + "/low.webp"}
                width={500} height={500}alt={`${elem.name}#${elem.id}`} />
            </div>
            <div className="w-full flex justify-center lg:justify-between gap-4 px-1 lg:gap-0">
                <Button color="none" content={<FaMinus />} style="rounded-full bg-[var(--background)_!important] lg:bg-[transparent_!important] p-2 lg:p-0 lg:text-xs"
                disabled={quantity < 1} onClick={() => removeCard(elem)} />
                <p className="text-lg lg:text-base text-center">{quantity}</p>
                <Button color="none" content={<FaPlus />} style="rounded-full bg-[var(--background)_!important] lg:bg-[transparent_!important] p-2 lg:p-0 lg:text-xs"
                disabled={disableAdd} onClick={() => addCard(elem)} />
            </div>
        </div>
    )
}