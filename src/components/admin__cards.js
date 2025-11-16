import { useState } from "react";
import Pagination from "./pagination";
import Button from "./button";

export default function AdminCards({content}) {
    const [pageNumber, setPageNumber] = useState(0);
    const [showDetails, setShowDetails] = useState(-1);

    const PER_PAGE = 10;

    const CardElement = ({card, index}) => {
        const getCardDate = () => {
            const updated = new Date(card.lastUpdate);

            return updated.toLocaleString("en-GB").replace(/\//g, "/");
        }

        const cardData = card.data;

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

         const GetDetails = () => {
            return (
                <div className="w-full flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col">
                        <div className="flex flex-col p-0.5 gap-0.5 bg-background-1 font-light">
                            <div className="flex-1 p-2 bg-background-2">
                                <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-4 2xl:gap-8 py-1">
                                    <p><span className="opacity-60 font-medium">CATEGORY: </span>{cardData.category}</p>
                                    {cardData.stage && 
                                    <p><span className="opacity-60 font-medium">STAGE: </span>{cardData.stage.replace("Stage", "")}</p>}
                                    {cardData.trainerType &&
                                    <p><span className="opacity-60 font-medium">TRAINER TYPE: </span>{cardData.trainerType}</p>}
                                    {cardData.energyType &&
                                    <p><span className="opacity-60 font-medium">ENERGY TYPE: </span>{cardData.energyType}</p>}
                                    {cardData.types && cardData.types[0] &&
                                    <p><span className="opacity-60 font-medium">TYPE: </span>{cardData.types[0]}</p>}
                                    {cardData.retreat > 0 &&
                                    <p><span className="opacity-60 font-medium">RETREAT COST: </span>{cardData.retreat}</p>}
                                </div>
                                {cardData.effect &&
                                <p className="mt-4 2xl:mt-8"><span className="opacity-60 font-medium ">EFFECT: </span>{cardData.effect}</p>}
                                
                                {cardData.abilities &&
                                <>
                                <p className="opacity-60 font-medium mt-4">ABILITIES:</p>
                                    {
                                        cardData.abilities.map(abi => {
                                            return (
                                                <div className="flex flex-col" key={abi.name}>
                                                    <h2 className="flex items-center underline font-semibold">
                                                        {abi.name}
                                                    </h2>
                                                    <p>
                                                        {abi.effect}
                                                    </p>
                                                </div>
                                            )
                                        })
                                    }
                                </>}
                                {cardData.attacks &&
                                <>
                                <h2 className="opacity-60 font-medium mt-4">ATTACKS:</h2>
                                    <div className="flex flex-col gap-4">
                                    {
                                        cardData.attacks.map(att => {
                                            return (
                                                <div className="flex flex-col" key={att.name}>
                                                    <div>
                                                        <h3 className="flex items-center">
                                                            <span className="underline font-semibold">{att.name}, </span> 
                                                            {att.cost && 
                                                                <span className="font-normal ml-1">Cost: <span className="font-bold">{getAttackCost(att)}</span></span>
                                                            }
                                                            {(att.damage && att.damage > 0) && 
                                                                <>, Damage: <span className="font-bold ml-1">{att.damage}</span></>
                                                            }
                                                        </h3>
                                                    </div>
                                                    <p>
                                                        {att.effect}
                                                    </p>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        const updated = getCardDate();
        
        return (
            <div className="flex flex-col flex-1 border-b border-foreground/30 p-2">
                <div className="flex flex-col 2xl:flex-row 2xl:items-center gap-x-4 2xl:gap-8 py-1">
                    <p className="2xl:flex-1 truncate"><span className="2xl:hidden opacity-60 font-medium">NAME: </span>{cardData.name}</p>
                    <p className="2xl:flex-1 truncate"><span className="2xl:hidden opacity-60 font-medium">SET: </span>{cardData.set.name}</p>
                    <p className="2xl:flex-1 truncate"><span className="2xl:hidden opacity-60 font-medium">NUMBER: </span>{cardData.localId}</p>
                    <div className="2xl:flex-1 flex 2xl:flex-col gap-2 2xl:gap-0">
                        <span className="w-fit 2xl:hidden opacity-60 font-medium">LEGALITY: </span>
                            <p>
                                Standard: 
                                    {cardData.legal.standard 
                                        ? <span className="text-emerald-500"> Legal</span>
                                        : <span className="text-red-500"> Illegal</span>
                                    }
                            </p>
                            <p>
                                Expanded:
                                    {cardData.legal.expanded 
                                        ? <span className="text-emerald-500"> Legal</span>
                                        : <span className="text-red-500"> Illegal</span>
                                    }
                            </p>
                    </div>
                    <p className="2xl:flex-1"><span className="2xl:hidden opacity-60 font-medium">UPDATED: </span>{updated}</p>
                </div>
                <Button color="blue" className="flex items-center gap-1 px-8 py-1 font-medium rounded-sm mt-8 text-sm self-end 2xl:self-center"
                onClick={() => {
                    const indexToShow = showDetails !== index ? index : -1;
                    setShowDetails(indexToShow);
                } 

                }>
                        <p>{`${showDetails === index ? "Hide" : "Show"}`} details</p>
                </Button>
                {
                    showDetails === index && 
                    
                    <div className="mt-4">
                        <div className="flex flex-col rounded">
                            <GetDetails />
                        </div>
                    </div>
                }
            </div>
        )
    }

    let subList = [];

    if (content.length > 0) {
        const startIndex = pageNumber * PER_PAGE;
        const endIndex = startIndex + PER_PAGE;

        subList = content.slice(startIndex, endIndex);
    }

    return (
        <div className="w-full flex-1 flex flex-col 2xl:text-lg">
            <div className="flex-1 flex flex-col">
                <div className="hidden 2xl:flex font-semibold mb-1 gap-8 uppercase opacity-70 px-2">
                    <p className="flex-1">name</p>
                    <p className="flex-1">set</p>
                    <p className="flex-1">number</p>
                    <p className="flex-1">legality</p>
                    <p className="flex-1">last updated</p>
                </div>
                <div className="border border-b-0 border-foreground/30 font-light">
                    {
                        subList.map((card, index) =>{
                            return (
                                <CardElement key={card._id} card={card} index={index} />
                            )
                        })
                    }
                </div>
            </div>
            <Pagination quantity={content.length} pageNumber={pageNumber} perPage={PER_PAGE} setPageNumber={setPageNumber} />
        </div>
    )
}