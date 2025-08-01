import { useDeckContext } from "@/context/deck-context";
import Image from "next/image";
import { useEffect } from "react";
import { FaPlus } from "react-icons/fa";

export default function BuilderImageSelector({setShowImgSelector}) {
    const {
        name, setName, cards, setCards, image, setImage, legal, setLegal, hasChanges, setHasChanges, addCard, removeCard, cardQuantityRef
    } = useDeckContext();

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-[#0008] flex flex-col items-center justify-center z-[100_!important] p-4">
            <div className="w-full max-w-[600px] flex flex-col gap-8 rounded md:rounded-lg lg:rounded-xl p-8 bg-background">
                <div className="flex items-center justify-between">
                    <p className="text-xl">Pick a deck cover card</p>
                    <button className="cursor-pointer opacity-60 hover:opacity-100" onClick={() => setShowImgSelector(false)}>
                        <FaPlus className="text-2xl text-foreground rotate-45" />
                    </button>
                </div>
                <div className="grid gap-2 md:gap-4 xl:gap-6 grid-cols-4 md:grid-cols-5 xl:grid-cols-7">
                    {
                        cards.map((elem) => {
                            return (
                                <div key={elem.card.id} className="w-full relative">
                                    <Image className="object-contain" priority src={elem.card.image + "/low.webp"}
                                    width={500} height={500}alt={`${elem.card.name}#${elem.card.id}`} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            
        </div>
    )
}