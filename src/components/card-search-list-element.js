"use client";
import Image from "next/image";
import Button from "./button";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDeckContext } from "@/context/deck-context";

export default function CardSearchListElement({elem, initialQuantity}) {
    const {
        name, setName, cards, setCards, image, setImage, legal, setLegal, hasChanges, setHasChanges, addCard, removeCard, cardQuantity, setCardQuantity
    } = useDeckContext();
    
    const [quantity, setQuantity] = useState(initialQuantity);
    const [disableAdd, setDisableAdd] = useState(false);

    const doAddCard = (card) => {
        const cardAdded = addCard(card);

        if (cardAdded)
            setQuantity(quantity + 1);
        else
            alert("ke aze XD");
    }

    const doRemoveCard = (card) => {
        const cardRemoved = removeCard(card);

        if (cardRemoved)
            setQuantity(quantity - 1);
        else
            alert("ke aze XD");
    }

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
                <Button color="blue" content={<FaMinus />} style="text-xs p-[0_!important]" disabled={quantity < 1} onClick={() => doRemoveCard(elem)} />
                <p className="text-center">{quantity}</p>
                <Button color="blue" content={<FaPlus />} style="text-xs p-[0_!important]" disabled={quantity >= 4 || disableAdd} onClick={() => doAddCard(elem)} />
            </div>
        </div>
    )
}