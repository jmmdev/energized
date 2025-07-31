"use client";
import { useEffect, useState } from "react";

export default function DeckImageSelector({deckImg, cards}) {
    const [selected, setSelected] = useState(-1);

    useEffect(() => {
        const selectedIndex = deckImg ? cards.findIndex((elem) => elem.img === deckImg) : 0;
        setSelected(selectedIndex);
    }, [])

    return (
        <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center z-100 bg-[#0008]">
            <div className="w-full max-w-[600px] flex flex-wrap gap-4 bg-background-1 rounded-lg p-4">
                {
                    cards.map((elem) => {
                        return (
                            <></>
                        )
                    })
                }
            </div>
        </div>
    )
}