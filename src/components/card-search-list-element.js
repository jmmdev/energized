"use client";
import Image from "next/image";
import Button from "./button";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDeckContext } from "@/context/deck-context";

export default function CardSearchListElement({elem, quantity}) {
    const {
        countCardsWithName, cardHasLimit, addCard, removeCard, cardQuantity
    } = useDeckContext();

    const [disableAdd, setDisableAdd] = useState(false);

    const minusDisabled = quantity < 1;
    const plusDisabled = (cardHasLimit(elem.name) && countCardsWithName(elem.name) >= 4) || disableAdd;

    useEffect(() => {
        setDisableAdd(cardQuantity >= 60);
    }, [cardQuantity])

    return (
        <div key={elem.id} className="w-full flex flex-col gap-2">
            <div className="w-full relative">
                <Image className="object-contain" priority src={elem.image + "/low.webp"}
                width={500} height={500}alt={`${elem.name}#${elem.id}`} />
            </div>
            <div className="w-full grid grid-cols-3 justify-between gap-1">
                <Button color="none" content={<FaMinus />} style="text-xs p-[0_!important]"
                disabled={minusDisabled} onClick={() => removeCard(elem)} />
                <p className="text-center">{quantity}</p>
                <Button color="none" content={<FaPlus />} style="text-xs p-[0_!important]"
                disabled={plusDisabled} onClick={() => addCard(elem)} />
            </div>
        </div>
    )
}