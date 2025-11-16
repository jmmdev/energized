"use client";

import { useEffect } from "react";
import { FaPlus } from "react-icons/fa";

export default function CardZoomIn({zoomIn, setZoomIn, elem, zoomRef}) {

    useEffect(() => {
        if (zoomIn)
            document.body.style.overflow = "hidden"
        else
            document.body.style.overflow = ""
    }, [zoomIn])

    const getAttackCost = (attack) => {
        let costMap = {};

        for (let c of attack.cost) {
            if (costMap.hasOwnProperty(c)) {
                costMap[c]++;
            }
            else {
                costMap[c] = 1;
            }
        }

        let costString = "";

        const entries = Object.entries(costMap);

        for (const [index, [key, value]] of Object.entries(entries)) {
            costString += `${value} ${key}`;
            if (index < entries.length - 1)
                costString += ", "
        }

        return costString;
    }

    const GetInfo = ({card}) => {
        let output = [];

        if (card.abilities) {
            for (let abi of card.abilities) {
                output.push(
                    <div className="flex flex-col gap-2" key={abi.name}>
                        <p className="flex items-center gap-2 text-2xl">
                            <span className="py-0.5 px-2 rounded-sm bg-red-500">{abi.type}</span>
                            <span className="font-semibold text-red-500">{abi.name}</span>
                        </p>
                        <p className="text-xl">
                            {abi.effect}
                        </p>
                    </div>
                )
            }
        }

        if (card.attacks) {
            for (let att of card.attacks) {
                output.push(
                    <div className="flex flex-col gap-2" key={att.name}>
                        <div>
                            <b className="text-2xl">{att.name}</b>
                            <p className="font-light text-lg">
                                {att.cost && <>Cost: <span className="font-bold">{getAttackCost(att)}</span></>}
                            </p>
                            <p className="text-lg">
                                {(att.damage && att.damage > 0) && <>Damage: <span className="font-bold">{att.damage}</span></>}
                            </p>
                        </div>
                        <p className="text-xl">
                            {att.effect}
                        </p>
                    </div>
                )
            }
        }

        return output;
    }

    if (zoomIn && zoomRef.current) {
        const card = elem.card || elem;

        if (zoomRef.current === card.id)
            return (
                <div className="fixed flex flex-col w-screen h-screen bg-[#000d] text-my-white z-100 top-0 left-0 overflow-y-auto builder-scrollbar">
                    <div className="relative w-full flex-1 flex flex-col justify-center items-center gap-12">
                        <div className="flex flex-col">
                            <div className="fixed top-0 right-0 z-110 text-my-white opacity-60 hover:opacity-100 cursor-pointer p-4 self-end text-3xl"
                            onClick={() => setZoomIn(false)}>
                                <FaPlus />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center p-8 gap-8">
                                <div className="w-full flex flex-col self-center gap-2 max-w-[300px] sm:max-w-sm">
                                    <img className="block max-w-full" src={card.image + "/high.webp"} 
                                    alt={`${card.name}#${card.id}`} />
                                </div>
                                <div className="flex flex-col gap-8 w-full sm:max-w-sm self-center text-left">
                                    <div>
                                        <p className="font-bold uppercase text-2xl">{card.name}</p>
                                        <p className="text-xl">{card.stage || card.trainerType || card.energyType} {card.types && card.types[0]} {card.category}</p>
                                        {card.hp && <p className="text-xl">HP: <b>{card.hp}</b></p>}
                                    </div>
                                    <GetInfo card={card} />
                                    {card.effect && <p className="text-xl"> {card.effect}</p>}
                                    {card.retreat > 0 && <p className="text-xl">Retreat cost: <b>{card.retreat}</b></p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
}